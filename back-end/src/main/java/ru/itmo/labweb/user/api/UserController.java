package ru.itmo.labweb.user.api;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.itmo.labweb.security.JwtProvider;
import ru.itmo.labweb.user.UserService;
import ru.itmo.labweb.user.model.User;

import java.util.stream.Stream;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtTokenProvider;

    public UserController(UserService service, AuthenticationManager authenticationManager, JwtProvider jwtTokenProvider) {
        this.userService = service;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/login")
    public String login(@RequestBody AuthenticationRequestDto requestDto) {
        try {
            String username = requestDto.getUsername();
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, requestDto.getPassword()));

            return jwtTokenProvider.createAccessToken(username);
        } catch (AuthenticationException e) {
            throw new BadCredentialsException(e.getMessage());
        }
    }

    @PostMapping("/register")
    public void register(@RequestBody AuthenticationRequestDto requestDto) {
        userService.registerUser(new User(requestDto.getUsername(), requestDto.getPassword()));
    }

    @GetMapping("/me")
    public UserDto getUser(@AuthenticationPrincipal String user) {
        return UserDto.fromUser(userService.getByUsernameStrict(user));
    }

    @GetMapping("/top")
    public Stream<UserDto> getTopUsers() {
        return userService.getTopUsers().map(UserDto::fromUser);
    }
}
