package ru.itmo.labweb.user;

import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import ru.itmo.labweb.security.JwtAuthenticationException;
import ru.itmo.labweb.user.api.UserDto;
import ru.itmo.labweb.user.model.User;

import java.util.Optional;
import java.util.stream.Stream;

@Service
public class UserService implements UserDetailsService {

    private static final double SCORE_DIFF_POWER = 0.75;
    private static final long SCORE_BASE = 10;
    private static final long SCORE_MIN = 1;

    private final UserRepository repository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final SimpMessagingTemplate messagingTemplate;

    public UserService(
            UserRepository repository,
            BCryptPasswordEncoder passwordEncoder,
            SimpMessagingTemplate messagingTemplate
    ) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.messagingTemplate = messagingTemplate;
    }

    public User registerUser(User user) {
        if (repository.findByUsername(user.getUsername()).isPresent()) {
            throw new JwtAuthenticationException("username is busy");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return repository.save(user);
    }

    public User getByUsernameStrict(String username) {
        return repository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("user " + username + " not found"));
    }

    public Optional<User> getByUsername(String username) {
        return repository.findByUsername(username);
    }

    @Override
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        return getByUsernameStrict(username);
    }

    public Stream<User> getTopUsers() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "score")).stream();
    }

    public void updateUsersStats(String winnerName, String looserName) {
        User looser = getByUsernameStrict(looserName);
        User winner = getByUsernameStrict(winnerName);

        looser.setLoses(looser.getLoses() + 1);
        winner.setWins(winner.getWins() + 1);

        long score = scoreFun(winner.getScore(), looser.getScore());
        winner.setScore(winner.getScore() + score);
        looser.setScore(Math.max(0, looser.getScore() - score));

        repository.save(winner);
        repository.save(looser);

        messagingTemplate.convertAndSend("/user/" + winnerName + "/me", UserDto.fromUser(winner));
        messagingTemplate.convertAndSend("/user/" + looserName + "/me", UserDto.fromUser(looser));
    }

    private static long scoreFun(long winner, long looser) {
        return Math.max(SCORE_MIN, SCORE_BASE + scoreDeviationFun(looser - winner));
    }

    private static long scoreDeviationFun(long diff) {
        if (diff < 0) {
            return -scoreDeviationFun(-diff);
        }

        return (long) Math.pow(diff, SCORE_DIFF_POWER);
    }
}