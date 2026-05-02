package com.xxxpert.xyxarxpert.services;

import com.xxxpert.xyxarxpert.entities.EmailVerificationCode;
import com.xxxpert.xyxarxpert.entities.User;
import com.xxxpert.xyxarxpert.repositories.UserRepository;
import com.xxxpert.xyxarxpert.repositories.VerificationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


import java.time.OffsetDateTime;


@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {


    private final VerificationRepository verificationRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;


    @Value("${spring.mail.username}")
    private String fromEmail;

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

    public void sendCode(String email, String code) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject("Подтверждение регистрации");
        message.setText("""
                Ваш код подтверждения: %s
                
                Если это были не вы — просто проигнорируйте письмо.
                """.formatted(code));

        mailSender.send(message);
    }
}
