package com.xxxpert.xyxarxpert.services;

import com.xxxpert.xyxarxpert.UserAlreadyExistsException;
import com.xxxpert.xyxarxpert.entities.EmailVerificationCode;
import com.xxxpert.xyxarxpert.entities.RegisterRequest;
import com.xxxpert.xyxarxpert.entities.User;
import com.xxxpert.xyxarxpert.repositories.UserRepository;
import com.xxxpert.xyxarxpert.repositories.VerificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final VerificationRepository verificationRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Value("${app.email-verification}")
    public boolean emailVerificationEnabled;

    public String generateCode() {
        return String.valueOf((int)(Math.random() * 900000) + 100000);
    }

    public void registerUser(RegisterRequest request){

        log.debug("Start user registration: email={}", request.getEmail());

        if (userRepository.findByEmail(request.getEmail()).isPresent()){
            log.warn("Registration failed: user already exists, email={}", request.getEmail());
            throw new UserAlreadyExistsException("User already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setMiddleName(request.getMiddleName());
        user.setLastName(request.getLastName());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole("user");
        user.setRegisteredAt(OffsetDateTime.now());
        user.setEnabled(false);

        if (emailVerificationEnabled) {

            String code = generateCode();

            log.debug("Email verification enabled: email={}", user.getEmail());

            EmailVerificationCode evc = new EmailVerificationCode();
            evc.setEmail(user.getEmail());
            evc.setCode(code);
            evc.setExpiresAt(OffsetDateTime.now().plusMinutes(10));

            verificationRepository.save(evc);
            emailService.sendCode(user.getEmail(), code);

        } else {
            log.debug("Email verification disabled: auto-enable user, email={}", user.getEmail());
            user.setEnabled(true);
        }

        userRepository.save(user);

        log.info("User registered: email={}, enabled={}", user.getEmail(), user.getEnabled());
    }
}
