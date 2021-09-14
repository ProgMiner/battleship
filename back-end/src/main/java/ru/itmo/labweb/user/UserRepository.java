package ru.itmo.labweb.user;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.itmo.labweb.user.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
