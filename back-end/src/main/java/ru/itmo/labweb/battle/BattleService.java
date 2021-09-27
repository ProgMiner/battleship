package ru.itmo.labweb.battle;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import ru.itmo.labweb.battle.api.BattleDto;
import ru.itmo.labweb.user.UserService;

import java.util.HashSet;
import java.util.Set;

import static ru.itmo.labweb.battle.Battle.Field.FIELD_SIZE;

@Service
public class BattleService {

    private final BattleRepository repository;
    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper json;

    public BattleService(BattleRepository repository, UserService userService, SimpMessagingTemplate messagingTemplate, ObjectMapper json) {
        this.repository = repository;
        this.userService = userService;
        this.messagingTemplate = messagingTemplate;
        this.json = json;
    }

    public void createBattle(String player1, String player2) {
        if (repository.findBattle(player1) != null || repository.findBattle(player2) != null) {
            throw new IllegalArgumentException("one of the players already has active game");
        }

        Battle newBattle = new Battle(Battle.Stage.ARRANGEMENT, player1, player2, player1, false, false);

        saveBattle(newBattle);

        for (String player : new String[] { player1, player2 }) {
            messagingTemplate.convertAndSend(
                    "/user/" + player + "/battle",
                    BattleDto.fromBattle(newBattle, player, userService)
            );
        }
    }

    public Battle commitField(String username) {
        Battle battle = getBattleStrict(username);

        assertStageCorrect(battle, Battle.Stage.ARRANGEMENT);
        assertFieldNotCommitted(battle, username);

        if (!checkField(battle.getMyField(username))) {
            throw new IllegalStateException("bad field");
        }

        battle.setPlayerCommitted(username);

        if (battle.isBothPlayersCommitted()) {
            battle.setStage(Battle.Stage.BATTLE);

            messagingTemplate.convertAndSend("/user/" + battle.getEnemy(username) + "/battle",
                    BattleDto.fromBattle(battle, battle.getEnemy(username), userService));
        }

        saveBattle(battle);
        return battle;
    }

    public Battle changeCell(int x, int y, String username) throws IllegalArgumentException {
        checkPassedCoords(x, y);

        Battle battle = getBattleStrict(username);

        assertStageCorrect(battle, Battle.Stage.ARRANGEMENT);
        assertFieldNotCommitted(battle, username);

        if (!checkShipPossibility(x, y, battle.getMyField(username))) {
            throw new IllegalArgumentException("unavailable ship position");
        }

        Battle.CellState currentCellState = battle.getMyField(username).getCellState(x, y);
        Battle.CellState newCellState = currentCellState == Battle.CellState.EMPTY
                ? Battle.CellState.SHIP : Battle.CellState.EMPTY;

        battle.getMyField(username).setCellState(x, y, newCellState);

        saveBattle(battle);
        return battle;
    }

    public Battle shotCell(int x, int y, String username) {
        checkPassedCoords(x, y);

        Battle battle = getBattleStrict(username);

        assertStageCorrect(battle, Battle.Stage.BATTLE);
        assertTurnOrder(battle, username);

        Battle.CellState currentCellState = battle.getEnemyField(username).getCellState(x, y);

        if (currentCellState == Battle.CellState.SHOT) {
            return battle;
        }

        Battle.CellState newCellState = currentCellState == Battle.CellState.SHIP
                ? Battle.CellState.SHOT : Battle.CellState.MISS;

        battle.getEnemyField(username).setCellState(x, y, newCellState);
        battle.getStepsHistory().add(new Battle.Step(username, x, y,
                newCellState == Battle.CellState.SHOT ? Battle.StepStatus.SHOT : Battle.StepStatus.MISS));

        if (newCellState == Battle.CellState.SHOT) {
            Set<Battle.Coords> coords = getKilledShipCords(battle.getEnemyField(username), x, y);

            if (coords != null) {
                fillAroundShip(battle.getEnemyField(username), coords);
            }
        }

        if (checkIsPlayerKilled(battle.getEnemyField(username))) {
            battle.setStage(Battle.Stage.END);

            userService.updateUsersStats(username, battle.getEnemy(username));
        }

        if (newCellState == Battle.CellState.MISS) {
            battle.setWhoseTurn(battle.getEnemy(username));
        }

        messagingTemplate.convertAndSend("/user/" + battle.getEnemy(username) + "/battle",
                BattleDto.fromBattle(battle, battle.getEnemy(username), userService));

        saveBattle(battle);
        return battle;
    }

    public Battle getBattle(String username) {
        return loadBattle(username);
    }

    private static void checkPassedCoords(int x, int y) {
        if (x >= FIELD_SIZE || y >= FIELD_SIZE || x < 0 || y < 0) {
            throw new IllegalArgumentException("passed coords are out of field size");
        }
    }

    private Battle getBattleStrict(String username) {
        Battle battle = loadBattle(username);

        if (battle == null) {
            throw new IllegalArgumentException("battle not found");
        }

        return battle;
    }

    private Battle loadBattle(String username) {
        return Battle.fromEntity(repository.findBattle(username), json);
    }

    private void saveBattle(Battle battle) {
        repository.save(battle.toEntity(userService, json));
    }

    private static boolean checkShipPossibility(int x, int y, Battle.Field field) {
        if (field.getCellState(x, y) == Battle.CellState.SHIP) {
            return true;
        }

        for (int dx : new int[] { -1, +1 }) {
            for (int dy : new int[] { -1, +1 }) {
                if (field.getCellState(x + dx, y + dy) == Battle.CellState.SHIP) {
                    return false;
                }
            }
        }

        // Check length

        int len = 1;
        boolean vertical = field.getCellState(x, y - 1) == Battle.CellState.SHIP
                || field.getCellState(x, y + 1) == Battle.CellState.SHIP;

        if (vertical) {
            for (int dy : new int[] { -1, +1 }) {
                for (int checkingY = y + dy; checkingY >= 0 && checkingY < FIELD_SIZE; checkingY += dy) {
                    if (field.getCellState(x, checkingY) == Battle.CellState.EMPTY) {
                        break;
                    }

                    len++;
                }
            }
        } else {
            for (int dx : new int[] { -1, +1 }) {
                for (int checkingX = x + dx; checkingX >= 0 && checkingX < FIELD_SIZE; checkingX += dx) {
                    if (field.getCellState(checkingX, y) == Battle.CellState.EMPTY) {
                        break;
                    }

                    len++;
                }

            }
        }

        if (len > 4) {
            return false;
        }

        return true;
    }

    public static boolean checkField(Battle.Field field) {
        int[] ships = new int[5];
        int currentLength = 0;

        for (int i = 0; i < FIELD_SIZE; ++i) {
            for (int j = 0; j < FIELD_SIZE; ++j) {
                if (field.getCellState(i, j) == Battle.CellState.SHIP) {
                    currentLength++;
                }

                if (currentLength > 0 && (j == FIELD_SIZE - 1 || field.getCellState(i, j) == Battle.CellState.EMPTY)) {
                    ships[currentLength]++;
                    currentLength = 0;
                }
            }
        }

        for (int i = 0; i < FIELD_SIZE; ++i) {
            for (int j = 0; j < FIELD_SIZE; ++j) {
                if (field.getCellState(j, i) == Battle.CellState.SHIP) {
                    currentLength++;
                }

                if (currentLength > 0 && (field.getCellState(j, i) == Battle.CellState.EMPTY || j == FIELD_SIZE - 1)) {
                    ships[currentLength]++;
                    currentLength = 0;
                }
            }
        }

        return ships[4] == 1
                && ships[3] == 2
                && ships[2] == 3
                && ships[1] == 8 + 16; // 16 is an amount of false single ships
    }

    private static boolean checkIsPlayerKilled(Battle.Field field) {
        for (int i = 0; i < FIELD_SIZE; ++i) {
            for (int j = 0; j < FIELD_SIZE; ++j) {
                if (field.getCellState(j, i) == Battle.CellState.SHIP) {
                    return false;
                }
            }
        }

        return true;
    }

    private static Set<Battle.Coords> getKilledShipCords(Battle.Field field, int x, int y) {
        Set<Battle.Coords> result = new HashSet<>();
        result.add(new Battle.Coords(x, y));

        boolean len1 = true;
        for (int dx : new int[] { -1, 0, +1 }) {
            for (int dy : new int[] { -1, 0, +1 }) {
                if (dx == dy || dx == -dy) {
                    // if diagonal or central cell
                    continue;
                }

                if (field.getCellState(x + dx, y + dy) == Battle.CellState.SHIP) {
                    return null;
                }

                if (field.getCellState(x + dx, y + dy) == Battle.CellState.SHOT) {
                    len1 = false;
                }
            }
        }

        if (len1) {
            return result;
        }

        boolean vertical = field.getCellState(x, y - 1) == Battle.CellState.SHOT
                || field.getCellState(x, y + 1) == Battle.CellState.SHOT;

        if (vertical) {
            for (int dy : new int[] { -1, +1 }) {
                for (int checkingY = y + dy; checkingY >= 0 && checkingY < FIELD_SIZE; checkingY += dy) {
                    if (field.getCellState(x, checkingY) == Battle.CellState.SHIP) {
                        return null;
                    }

                    if (isNoShip(field.getCellState(x, checkingY))) {
                        break;
                    }

                    result.add(new Battle.Coords(x, checkingY));
                }
            }
        } else {
            for (int dx : new int[] { -1, +1 }) {
                for (int checkingX = x + dx; checkingX >= 0 && checkingX < FIELD_SIZE; checkingX += dx) {
                    if (field.getCellState(checkingX, y) == Battle.CellState.SHIP) {
                        return null;
                    }

                    if (isNoShip(field.getCellState(checkingX, y))) {
                        break;
                    }

                    result.add(new Battle.Coords(checkingX, y));
                }
            }
        }

        return result;
    }

    private static boolean isNoShip(Battle.CellState cell) {
        return cell == Battle.CellState.EMPTY || cell == Battle.CellState.MISS;
    }

    private static void fillAroundShip(Battle.Field field, Set<Battle.Coords> ship) {
        int minX = FIELD_SIZE, maxX = 0, minY = FIELD_SIZE, maxY = 0;

        for (Battle.Coords coords : ship) {
            if (minX > coords.x) {
                minX = coords.x;
            }

            if (maxX < coords.x) {
                maxX = coords.x;
            }

            if (minY > coords.y) {
                minY = coords.y;
            }

            if (maxY < coords.y) {
                maxY = coords.y;
            }
        }

        for (int x = minX - 1; x <= maxX + 1; ++x) {
            for (int y = minY - 1; y <= maxY + 1; ++y) {
                if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
                    continue;
                }

                if (field.getCellState(x, y) == Battle.CellState.EMPTY) {
                    field.setCellState(x, y, Battle.CellState.MISS);
                }
            }
        }
    }

    private static void assertStageCorrect(Battle battle, Battle.Stage stage) {
        if (!battle.getStage().equals(stage)) {
            throw new IllegalStateException("wrong stage");
        }
    }

    private static void assertTurnOrder(Battle battle, String username) {
        if (!battle.getWhoseTurn().equals(username)) {
            throw new IllegalStateException("not your turn");
        }
    }

    private static void assertFieldNotCommitted(Battle battle, String username) {
        if (battle.isPlayerCommitted(username)) {
            throw new IllegalStateException("field is already committed");
        }
    }
}
