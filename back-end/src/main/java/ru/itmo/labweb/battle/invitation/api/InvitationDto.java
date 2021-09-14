package ru.itmo.labweb.battle.invitation.api;

import ru.itmo.labweb.battle.invitation.Invitation;

import java.time.LocalDateTime;

public class InvitationDto {

    private final String from;
    private final LocalDateTime createdAt;

    public InvitationDto(String from, LocalDateTime createdAt) {
        this.from = from;
        this.createdAt = createdAt;
    }

    public String getFrom() {
        return from;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public static InvitationDto fromInvitation(Invitation invitation) {
        return new InvitationDto(invitation.getFrom().getUsername(), invitation.getCreatedAt());
    }
}
