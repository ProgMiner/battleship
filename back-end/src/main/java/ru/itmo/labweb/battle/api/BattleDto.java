package ru.itmo.labweb.battle.api;

import ru.itmo.labweb.battle.Battle;
import ru.itmo.labweb.user.UserService;
import ru.itmo.labweb.user.api.UserDto;

import java.util.List;

public class BattleDto {
    public enum WhoseTurn {
        ME, ENEMY,
    }

    private final Battle.Stage stage;
    private final Battle.CellState[][] myField;
    private final Battle.CellState[][] enemyField;
    private final UserDto enemy;
    private final WhoseTurn whoseTurn;
    private final boolean playerCommitted;
    private final List<Battle.Step> stepsHistory;

    public BattleDto(
            Battle.Stage stage,
            Battle.CellState[][] myField,
            Battle.CellState[][] enemyField,
            UserDto enemy,
            WhoseTurn whoseTurn,
            boolean playerCommitted,
            List<Battle.Step> stepsHistory
    ) {
        this.stage = stage;
        this.myField = myField;
        this.enemyField = enemyField;
        this.enemy = enemy;
        this.whoseTurn = whoseTurn;
        this.playerCommitted = playerCommitted;
        this.stepsHistory = stepsHistory;
    }

    public Battle.Stage getStage() {
        return stage;
    }

    public Battle.CellState[][] getMyField() {
        return myField;
    }

    public Battle.CellState[][] getEnemyField() {
        return enemyField;
    }

    public UserDto getEnemy() {
        return enemy;
    }

    public WhoseTurn getWhoseTurn() {
        return whoseTurn;
    }

    public boolean isPlayerCommitted() {
        return playerCommitted;
    }

    public List<Battle.Step> getStepsHistory() {
        return stepsHistory;
    }

    public static BattleDto fromBattle(Battle battle, String username, UserService userService) {
        if (battle == null) {
            return null;
        }

        Battle.Field enemyField = battle.getEnemyField(username);

        return new BattleDto(
                battle.getStage(),
                battle.getMyField(username).toCellsArray(),
                battle.getStage() == Battle.Stage.END ? enemyField.toCellsArray() : enemyField.toEnemyCellsArray(),
                UserDto.fromUser(userService.getByUsernameStrict(battle.getEnemy(username))),
                battle.getWhoseTurn().equals(username) ? WhoseTurn.ME : WhoseTurn.ENEMY,
                battle.isPlayerCommitted(username),
                battle.getStepsHistory()
        );
    }
}