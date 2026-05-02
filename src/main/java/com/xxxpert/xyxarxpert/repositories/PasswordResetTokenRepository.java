package com.xxxpert.xyxarxpert.repositories;

import com.xxxpert.xyxarxpert.entities.PasswordResetToken;
import com.xxxpert.xyxarxpert.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<User> findByUser(User user);

    Optional<PasswordResetToken> findByToken(String token);
}
