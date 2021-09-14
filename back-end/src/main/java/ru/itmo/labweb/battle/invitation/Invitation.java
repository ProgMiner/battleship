package ru.itmo.labweb.battle.invitation;

import ru.itmo.labweb.user.model.User;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Invitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User from;

    @OneToOne
    private User to;

    private LocalDateTime createdAt;

    public Invitation() {
    }

    public Invitation(User from, User to, LocalDateTime createdAt) {
        this.from = from;
        this.to = to;
        this.createdAt = createdAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public User getFrom() {
        return from;
    }

    public void setFrom(User from) {
        this.from = from;
    }

    public User getTo() {
        return to;
    }

    public void setTo(User to) {
        this.to = to;
    }
}
