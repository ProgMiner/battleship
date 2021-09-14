package ru.itmo.labweb.battle;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BattleRepository extends JpaRepository<BattleEntity, Long> {

    @Query("SELECT b FROM Battle b " +
            "WHERE (b.player1.username = :username OR b.player2.username = :username) " +
            "AND b.stage <> ru.itmo.labweb.battle.Battle$Stage.END")
    BattleEntity findBattle(String username);
}
