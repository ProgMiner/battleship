package ru.itmo.labweb.battle.invitation.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.itmo.labweb.battle.invitation.InvitationService;

@RestController
@RequestMapping("/api/battle/invite")
public class InvitationController {
    private final InvitationService invitationService;

    public InvitationController(InvitationService invitationService) {
        this.invitationService = invitationService;
    }

    @GetMapping("")
    public ResponseEntity<InvitationDto> getInvitation(@AuthenticationPrincipal String username) {
        return invitationService.getInvitation(username)
                .map(InvitationDto::fromInvitation).map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{toUsername}")
    public ResponseEntity<Void> sendInvitation(@AuthenticationPrincipal String fromUsername, @PathVariable String toUsername) {
        try {
            invitationService.sendInvitation(fromUsername, toUsername);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (UnsupportedOperationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @PostMapping("/accept")
    public ResponseEntity<Void> acceptInvitation(@AuthenticationPrincipal String username) {
        try {
            if (invitationService.acceptInvitation(username)) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/reject")
    public ResponseEntity<Void> rejectInvitation(@AuthenticationPrincipal String username) {
        try {
            invitationService.rejectInvitation(username);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
