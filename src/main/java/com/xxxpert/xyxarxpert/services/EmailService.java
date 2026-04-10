package com.xxxpert.xyxarxpert.services;

import com.xxxpert.xyxarxpert.entities.EmailVerificationCode;
import com.xxxpert.xyxarxpert.entities.User;
import com.xxxpert.xyxarxpert.repositories.UserRepository;
import com.xxxpert.xyxarxpert.repositories.VerificationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final VerificationRepository verificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public boolean verifyCode(String email, String code) {

        EmailVerificationCode evc = verificationRepository
                .findTopByEmailOrderByExpiresAtDesc(email)
                .orElseThrow(() -> new RuntimeException("Code not found"));

        if (evc.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new RuntimeException("Code expired");
        }

        if (!evc.getCode().equals(code)) {
            throw new RuntimeException("Invalid code");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println(user.toString());
        user.setEnabled(true);
        userRepository.save(user);

        return true;
    }

    public void sendCode(String email, String code){
        System.out.println("CODE for " + email + ": " + code);
    }
}
