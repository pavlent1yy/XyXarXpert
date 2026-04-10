package com.xxxpert.xyxarxpert.repositories;

import com.xxxpert.xyxarxpert.entities.EmailVerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerificationRepository extends JpaRepository<EmailVerificationCode, Long> {
    Optional<EmailVerificationCode> findTopByEmailOrderByExpiresAtDesc(String email);
}
