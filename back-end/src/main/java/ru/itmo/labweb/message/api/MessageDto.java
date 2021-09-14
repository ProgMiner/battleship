package ru.itmo.labweb.message.api;

import ru.itmo.labweb.message.Message;
import ru.itmo.labweb.user.model.User;

import java.time.LocalDateTime;

public class MessageDto {

    private final long id;
    private final String authorName;
    private final String content;
    private final LocalDateTime createdAt;

    public MessageDto(long id, String authorName, String content, LocalDateTime createdAt) {
        this.id = id;
        this.authorName = authorName;
        this.content = content;
        this.createdAt = createdAt;
    }

    public long getId() {
        return id;
    }

    public String getAuthorName() {
        return authorName;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public static MessageDto fromMessage(Message message) {
        return new MessageDto(
                message.getId(),
                message.getAuthor().getUsername(),
                message.getContent(),
                message.getCreatedAt()
        );
    }

    public static Message toMessage(MessageDto messageDto, User user) {
        return new Message(
                null,
                user,
                messageDto.getContent(),
                LocalDateTime.now()
        );
    }
}
