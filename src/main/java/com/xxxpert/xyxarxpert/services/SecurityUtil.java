package com.xxxpert.xyxarxpert.services;

import com.xxxpert.xyxarxpert.entities.User;
import com.xxxpert.xyxarxpert.repositories.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@AllArgsConstructor
public class SecurityUtil {

    private final UserRepository userRepository;

    public User getCurrentUser() {

        var context = SecurityContextHolder.getContext();

        if (context.getAuthentication() == null) {
            log.warn("SecurityContext is empty");
            throw new RuntimeException("Unauthorized");
        }

        String email = context.getAuthentication().getName();

        if (email == null || email.equals("anonymousUser")) {
            log.warn("Anonymous access attempt");
            throw new RuntimeException("Unauthorized");
        }

        return userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.error("Authenticated user not found in DB: email={}", email);
                    return new RuntimeException("User not found");
                });
    }
}
