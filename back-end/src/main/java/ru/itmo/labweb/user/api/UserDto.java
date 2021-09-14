package ru.itmo.labweb.user.api;

import ru.itmo.labweb.user.model.User;

public class UserDto {

    private final long id;
    private final String username;
    private final long score;
    private final long wins;
    private final long loses;

    public UserDto(long id, String username, long score, long wins, long loses) {
        this.id = id;
        this.username = username;
        this.score = score;
        this.wins = wins;
        this.loses = loses;
    }

    public long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public long getScore() {
        return score;
    }

    public long getWins() {
        return wins;
    }

    public long getLoses() {
        return loses;
    }

    public static UserDto fromUser(User user) {
        return new UserDto(
                user.getId(),
                user.getUsername(),
                user.getScore(),
                user.getWins(),
                user.getLoses()
        );
    }
}
