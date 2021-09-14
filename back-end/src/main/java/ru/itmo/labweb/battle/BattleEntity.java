package ru.itmo.labweb.battle;

import ru.itmo.labweb.user.model.User;

import javax.persistence.*;

@Entity(name = "Battle")
public class BattleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Battle.Stage stage;

    @ManyToOne
    private User player1;

    @ManyToOne
    private User player2;

    @Column(columnDefinition = "char(100)")
    private String player1Field;

    @Column(columnDefinition = "char(100)")
    private String player2Field;

    @ManyToOne
    private User whoseTurn;

    private boolean player1Committed;

    private boolean player2Committed;

    @Column(columnDefinition = "text")
    private String stepsHistory;

    public BattleEntity() {}

    public BattleEntity(
            Long id,
            Battle.Stage stage,
            User player1,
            User player2,
            String player1Field,
            String player2Field,
            User whoseTurn,
            boolean player1Committed,
            boolean player2Committed,
            String stepsHistory
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Battle.Stage getStage() {
        return stage;
    }

    public void setStage(Battle.Stage stage) {
        this.stage = stage;
    }

    public User getPlayer1() {
        return player1;
    }

    public void setPlayer1(User player1) {
        this.player1 = player1;
    }

    public User getPlayer2() {
        return player2;
    }

    public void setPlayer2(User player2) {
        this.player2 = player2;
    }

    public String getPlayer1Field() {
        return player1Field;
    }

    public void setPlayer1Field(String player1Field) {
        this.player1Field = player1Field;
    }

    public String getPlayer2Field() {
        return player2Field;
    }

    public void setPlayer2Field(String player2Field) {
        this.player2Field = player2Field;
    }

    public User getWhoseTurn() {
        return whoseTurn;
    }

    public void setWhoseTurn(User whoseTurn) {
        this.whoseTurn = whoseTurn;
    }

    public boolean isPlayer1Committed() {
        return player1Committed;
    }

    public void setPlayer1Committed(boolean player1Committed) {
        this.player1Committed = player1Committed;
    }

    public boolean isPlayer2Committed() {
        return player2Committed;
    }

    public void setPlayer2Committed(boolean player2Committed) {
        this.player2Committed = player2Committed;
    }

    public String getStepsHistory() {
        return stepsHistory;
    }

    public void setStepsHistory(String stepsHistory) {
        this.stepsHistory = stepsHistory;
    }
}
