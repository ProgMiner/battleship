package ru.itmo.labweb.message;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import ru.itmo.labweb.message.api.MessageDto;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class MessageService {

    private static final int MAX_MESSAGE_AMOUNT = 20;

    private final MessageRepository repository;
    private final SimpMessagingTemplate messagingTemplate;

    public MessageService(MessageRepository repository, SimpMessagingTemplate messagingTemplate) {
        this.repository = repository;
        this.messagingTemplate = messagingTemplate;
    }

    public Message addMessage(Message message) {
        if (message.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("message cannot be blank");
        }

        message.setContent(message.getContent().trim());
        Message savedMessage = repository.save(message);

        messagingTemplate.convertAndSend("/all/chat", MessageDto.fromMessage(savedMessage));
        return savedMessage;
    }

    public List<Message> getLastMessages() {
        final Pageable pageable = PageRequest.of(0, MAX_MESSAGE_AMOUNT,
                Sort.by(Sort.Direction.DESC, "createdAt", "id"));

        final Page<Message> page = repository.findAll(pageable);
        final List<Message> messages = new ArrayList<>(page.getContent());

        Collections.reverse(messages);
        return messages;
    }
}
