package ru.itmo.labweb.battle.invitation;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import ru.itmo.labweb.battle.BattleService;
import ru.itmo.labweb.battle.invitation.api.InvitationDto;
import ru.itmo.labweb.user.UserService;
import ru.itmo.labweb.user.model.User;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class InvitationService {

    private static final Duration EXPIRING_TIME = Duration.of(5, ChronoUnit.MINUTES);

    private final InvitationRepository repository;
    private final UserService userService;
    private final BattleService battleService;
    private final SimpMessagingTemplate messagingTemplate;

    public InvitationService(
            InvitationRepository repository,
            UserService userService,
            BattleService battleService,
            SimpMessagingTemplate messagingTemplate
    ) {
        this.repository = repository;
        this.userService = userService;
        this.battleService = battleService;
        this.messagingTemplate = messagingTemplate;
    }

    public Invitation sendInvitation(String fromUsername, String toUsername) {
        User from = userService.getByUsernameStrict(fromUsername);
        User to = userService.getByUsername(toUsername)
                .orElseThrow(() -> new IllegalArgumentException("invalid username"));


        if (getInvitationByTo(to).isPresent()) {
            throw new UnsupportedOperationException("this user already has invitation");
        }

        Invitation newInvitation = new Invitation(from, to, LocalDateTime.now());

        messagingTemplate.convertAndSend("/user/" + toUsername + "/invitation", InvitationDto.fromInvitation(newInvitation));

        return repository.save(newInvitation);
    }

    public boolean acceptInvitation(String username) {
        Invitation invitation = getInvitationStrict(username);

        try {
            battleService.createBattle(invitation.getFrom().getUsername(), invitation.getTo().getUsername());
        } catch (IllegalArgumentException e) {
            return false;
        }

        repository.delete(invitation);
        return true;
    }

    public void rejectInvitation(String username) {
        repository.delete(getInvitationStrict(username));
    }

    private Invitation getInvitationStrict(String username) {
        return getInvitation(username).orElseThrow(() -> new IllegalArgumentException("invalid username"));
    }

    public Optional<Invitation> getInvitation(String toUsername) {
        return getInvitationByTo(userService.getByUsernameStrict(toUsername));
    }

    private Optional<Invitation> getInvitationByTo(User to) {
        return repository.findByTo(to).map(invitation -> {
            if (invitation.getCreatedAt().plus(EXPIRING_TIME).isBefore(LocalDateTime.now())) {
                repository.delete(invitation);
                return null;
            }

            return invitation;
        });
    }

    @Scheduled(fixedRate = 1000)
    private void removeExpiredInvitations() {
        List<Invitation> expiredInvitations = repository.findAllByCreatedAtBefore(LocalDateTime.now().minus(EXPIRING_TIME));

        for (Invitation invitation : expiredInvitations) {
            messagingTemplate.convertAndSend("/user/" + invitation.getTo().getUsername() + "/invitation", false);
        }

        if (!expiredInvitations.isEmpty()) {
            repository.deleteAll(expiredInvitations);
        }
    }
}
