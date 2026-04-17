package com.xxxpert.xyxarxpert.services;

import com.xxxpert.xyxarxpert.entities.EmailVerificationCode;
import com.xxxpert.xyxarxpert.entities.User;
import com.xxxpert.xyxarxpert.repositories.UserRepository;
import com.xxxpert.xyxarxpert.repositories.VerificationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {


    private final VerificationRepository verificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public boolean verifyCode(String email, String code) {

        log.debug("Start email verification: email={}", email);
        EmailVerificationCode evc = verificationRepository
                .findTopByEmailOrderByExpiresAtDesc(email)
                .orElseThrow(() -> {
                    log.warn("Verification failed: code not found, email={}", email);
                    return new RuntimeException("Code not found");
                });

        if (evc.getExpiresAt().isBefore(OffsetDateTime.now())) {
            log.warn("Verification failed: code expired, email={}", email);
            throw new RuntimeException("Code expired");
        }

        if (!evc.getCode().equals(code)) {
            log.warn("Verification failed: invalid code, email={}", email);
            throw new RuntimeException("Invalid code");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.error("User not found during verification: email={}", email);
                    return new RuntimeException("User not found");
                });

        user.setEnabled(true);
        userRepository.save(user);

        log.info("Email successfully verified: email={}", email);

        return true;
    }

    public void sendCode(String email, String code){
        log.debug("Sending verification code: email={}", email);
        log.debug("Verification code for {}: {}", email, code);
    }
}
