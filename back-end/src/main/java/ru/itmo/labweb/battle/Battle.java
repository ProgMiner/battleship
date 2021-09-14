package ru.itmo.labweb.battle;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import ru.itmo.labweb.user.UserService;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Battle {

    private final Long id;
    private Battle.Stage stage;
    private final String player1;
    private final String player2;
    private final Field player1Field;
    private final Field player2Field;
    private String whoseTurn;
    private boolean player1Committed;
    private boolean player2Committed;
    private final List<Step> stepsHistory;

    public Battle(
            Battle.Stage stage,
            String player1,
            String player2,
            String whoseTurn,
            boolean player1Committed,
            boolean player2Committed
    ) {
        this.id = null;
        this.stage = stage;
        this.player1 = player1;
        this.player2 = player2;
        this.player1Field = new Field();
        this.player2Field = new Field();
        this.whoseTurn = whoseTurn;
        this.player1Committed = player1Committed;
        this.player2Committed = player2Committed;
        this.stepsHistory = new ArrayList<>();
    }

    private Battle(
            Long id,
            Stage stage,
            String player1,
            String player2,
            Field player1Field,
            Field player2Field,
            String whoseTurn,
            boolean player1Committed,
            boolean player2Committed,
            List<Step> stepsHistory
    ) {
        this.id = id;
        this.stage = stage;
        this.player1 = player1;
        this.player2 = player2;
        this.player1Field = player1Field;
        this.player2Field = player2Field;
        this.whoseTurn = whoseTurn;
        this.player1Committed = player1Committed;
        this.player2Committed = player2Committed;
        this.stepsHistory = stepsHistory;
    }

    public String getEnemy(String username) {
        return username.equals(player1) ? player2 : player1;
    }

    public Field getMyField(String me) {
        return me.equals(player1) ? player1Field : player2Field;
    }

    public Field getEnemyField(String me) {
        return me.equals(player1) ? player2Field : player1Field;
    }

    public Battle.Stage getStage() {
        return stage;
    }

    public void setStage(Battle.Stage stage) {
        this.stage = stage;
    }

    public String getWhoseTurn() {
        return whoseTurn;
    }

    public void setWhoseTurn(String whoseTurn) {
        this.whoseTurn = whoseTurn;
    }

    public boolean isPlayerCommitted(String username) {
        return player1.equals(username) ? player1Committed : player2Committed;
    }

    public List<Step> getStepsHistory() {
        return stepsHistory;
    }

    public void setPlayerCommitted(String username) {
        if (player1.equals(username)) {
            player1Committed = true;
        }

        if (player2.equals(username)) {
            player2Committed = true;
        }
    }

    public boolean isBothPlayersCommitted() {
        return player1Committed && player2Committed;
    }

    public BattleEntity toEntity(UserService userService, ObjectMapper json) {
        try {
            return new BattleEntity(
                    id,
                    stage,
                    userService.getByUsernameStrict(player1),
                    userService.getByUsernameStrict(player2),
                    renderField(player1Field),
                    renderField(player2Field),
                    userService.getByUsernameStrict(whoseTurn),
                    player1Committed,
                    player2Committed,
                    json.writeValueAsString(stepsHistory)
            );
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException(e);
        }
    }

    public static Battle fromEntity(BattleEntity entity, ObjectMapper json) {
        if (entity == null) {
            return null;
        }

        try {
            return new Battle(
                    entity.getId(),
                    entity.getStage(),
                    entity.getPlayer1().getUsername(),
                    entity.getPlayer2().getUsername(),
                    parseField(entity.getPlayer1Field()),
                    parseField(entity.getPlayer2Field()),
                    entity.getWhoseTurn().getUsername(),
                    entity.isPlayer1Committed(),
                    entity.isPlayer2Committed(),
                    json.readValue(entity.getStepsHistory(), json.getTypeFactory().constructCollectionType(List.class, Step.class))
            );
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException(e);
        }
    }

    private static String renderField(Field field) {
        StringBuilder result = new StringBuilder();

        for (int y = 0; y < Field.FIELD_SIZE; ++y) {
            for (int x = 0; x < Field.FIELD_SIZE; ++x) {
                result.append(renderCellState(field.getCellState(x, y)));
            }
        }

        return result.toString();
    }

    private static Field parseField(String str) {
        Field field = new Field();

        int idx = 0;
        for (int y = 0; y < Field.FIELD_SIZE; ++y) {
            for (int x = 0; x < Field.FIELD_SIZE; ++x) {
                field.setCellState(x, y, parseCellState(str.charAt(idx++)));
            }
        }

        return field;
    }

    private static char renderCellState(CellState c) {
        switch (c) {
            case EMPTY: return '0';
            case SHIP: return '1';
            case MISS: return '2';
            case SHOT: return '3';
        }

        throw new UnsupportedOperationException("unsupported cell state");
    }

    private static CellState parseCellState(char c) {
        switch (c) {
            case '0': return CellState.EMPTY;
            case '1': return CellState.SHIP;
            case '2': return CellState.MISS;
            case '3': return CellState.SHOT;
        }

        throw new IllegalArgumentException("unknown cell state");
    }

    public enum CellState {
        EMPTY,
        SHIP,
        MISS,
        SHOT,
    }

    public enum Stage {
        ARRANGEMENT,
        BATTLE,
        END,
    }

    public enum StepStatus {
        MISS,
        SHOT,
    }

    public static class Step {

        private final String username;
        private final int x;
        private final int y;
        private final StepStatus status;

        public Step(String username, int x, int y, StepStatus status) {
            this.username = username;
            this.x = x;
            this.y = y;
            this.status = status;
        }

        public String getUsername() {
            return username;
        }

        public int getX() {
            return x;
        }

        public int getY() {
            return y;
        }

        public StepStatus getStatus() {
            return status;
        }
    }

    public static class Field {

        public static final int FIELD_SIZE = 10;

        private final CellState[][] field;

        public Field(CellState[][] field) {
            this.field = field;
        }

        public Field() {
            this(generateEmptyField());
        }

        public CellState getCellState(int x, int y) {
            if (x < 0 || x >= FIELD_SIZE || y < 0 || y >= FIELD_SIZE) {
                return null;
            }

            return field[y][x];
        }

        public void setCellState(int x, int y, CellState state) {
            if (x < 0 || x >= FIELD_SIZE || y < 0 || y >= FIELD_SIZE) {
                return;
            }

            field[y][x] = state;
        }

        public CellState[][] toCellsArray() {
            return this.field;
        }

        public CellState[][] toEnemyCellsArray() {
            Battle.CellState[][] result = new Battle.CellState[FIELD_SIZE][FIELD_SIZE];

            for (int i = 0; i < FIELD_SIZE; ++i) {
                for (int j = 0; j < FIELD_SIZE; ++j) {
                    if (field[i][j] == Battle.CellState.SHIP) {
                        result[i][j] = Battle.CellState.EMPTY;
                    } else {
                        result[i][j] = field[i][j];
                    }
                }
            }

            return result;
        }

        private static CellState[][] generateEmptyField() {
            CellState[][] field = new CellState[FIELD_SIZE][FIELD_SIZE];

            for (int i = 0; i < FIELD_SIZE; ++i) {
                for (int j = 0; j < FIELD_SIZE; ++j) {
                    field[i][j] = CellState.EMPTY;
                }
            }

            return field;
        }
    }

    public static class Coords {

        public final int x;
        public final int y;

        public Coords(int x, int y) {
            this.x = x;
            this.y = y;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;

            Coords coords = (Coords) o;
            return x == coords.x && y == coords.y;
        }

        @Override
        public int hashCode() {
            return Objects.hash(x, y);
        }
    }
}
