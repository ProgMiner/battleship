package ru.itmo.labweb.battle.invitation;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.itmo.labweb.user.model.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface InvitationRepository extends JpaRepository<Invitation, Long> {
    Optional<Invitation> findByTo(User to);

    List<Invitation> findAllByCreatedAtBefore(LocalDateTime time);

    void deleteAllByCreatedAtLessThan(LocalDateTime time);
}
