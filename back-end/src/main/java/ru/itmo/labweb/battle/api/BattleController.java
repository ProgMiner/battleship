package ru.itmo.labweb.battle.api;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.itmo.labweb.battle.BattleService;
import ru.itmo.labweb.user.UserService;

@RestController
@RequestMapping("/api/battle")
public class BattleController {
    private final BattleService battleService;
    private final UserService userService;

    public BattleController(UserService userService, BattleService battleService) {
        this.battleService = battleService;
        this.userService = userService;
    }


    @GetMapping
    public BattleDto getCurrentGame(@AuthenticationPrincipal String username) {
        return BattleDto.fromBattle(
                battleService.getBattle(username),
                username,
                userService
        );
    }

    @PostMapping("/cell")
    public ResponseEntity<BattleDto> toggleCell(@RequestParam int x, @RequestParam int y, @AuthenticationPrincipal String username) {
        try {
            return ResponseEntity.ok(BattleDto.fromBattle(battleService.changeCell(x, y, username), username, userService));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/commit")
    public ResponseEntity<BattleDto> commitField(@AuthenticationPrincipal String username) {
        try {
            return ResponseEntity.ok(BattleDto.fromBattle(battleService.commitField(username), username, userService));
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/step")
    public ResponseEntity<BattleDto> makeStep(@RequestParam int x, @RequestParam int y, @AuthenticationPrincipal String username) {
        try {
            return ResponseEntity.ok(BattleDto.fromBattle(battleService.shotCell(x, y, username), username, userService));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
