package ru.itmo.labweb.message.api;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.itmo.labweb.message.MessageService;
import ru.itmo.labweb.user.UserService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/message")
public class MessageController {
    
    private final MessageService service;
    private final UserService userService;

    public MessageController(MessageService service, UserService userService) {
        this.service = service;
        this.userService = userService;
    }

    @GetMapping
    public List<MessageDto> getLastMessages() {
        return service.getLastMessages().stream().map(MessageDto::fromMessage).collect(Collectors.toList());
    }

    @PostMapping
    public MessageDto addMessage(@RequestBody MessageDto messageDto, @AuthenticationPrincipal String username) {
        return MessageDto.fromMessage(service.addMessage(
                MessageDto.toMessage(messageDto, userService.getByUsernameStrict(username))
        ));
    }
}
