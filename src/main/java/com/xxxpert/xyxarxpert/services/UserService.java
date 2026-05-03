package com.xxxpert.xyxarxpert.services;

import com.xxxpert.xyxarxpert.UserAlreadyExistsException;
import com.xxxpert.xyxarxpert.entities.*;
import com.xxxpert.xyxarxpert.repositories.PasswordResetTokenRepository;
import com.xxxpert.xyxarxpert.repositories.UserRepository;
import com.xxxpert.xyxarxpert.repositories.VerificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final VerificationRepository verificationRepository;
    private final PasswordResetTokenRepository resetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Value("${app.email-verification}")
    public boolean emailVerificationEnabled;

    public String generateCode() {
        return String.valueOf((int)(Math.random() * 900000) + 100000);
    }

    public Optional<User> getUserByEmail(String email){
        return userRepository.findByEmail(email);
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
        user.setRole("USER");
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

    public PasswordResetToken generatePasswordResetToken(User user){

        PasswordResetToken resetToken = new PasswordResetToken();

        resetToken.setToken(UUID.randomUUID().toString());
        resetToken.setUser(user);
        resetToken.setUsed(false);
        resetToken.setCreatedAt(Instant.now());
        resetToken.setExpiresAt(Instant.now().plus(15, ChronoUnit.MINUTES));

        resetTokenRepository.save(resetToken);

        return resetToken;
    }

    public void sendPasswordResetEmail(User user){
        PasswordResetToken token = generatePasswordResetToken(user);
        emailService.sendResetToken(user.getEmail(), token.getToken());
    }

    public void resetPassword(String token, String newPassword){
        PasswordResetToken resetToken = resetTokenRepository.findByToken(token).orElseThrow();

        if (resetToken.getUsed()){
            throw new RuntimeException("Token already used");
        }

        if (resetToken.getExpiresAt().isBefore(Instant.now())) {
            throw new RuntimeException("Token expired");
        }

        User user = resetToken.getUser();

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        log.info("User: email={} reset their password", user.getEmail());
        userRepository.save(user);

        resetToken.setUsed(true);
        resetToken.setUsedAt(Instant.now());
        resetTokenRepository.save(resetToken);
    }

    @Transactional
    public void changePassword(User currentUser, String currentPassword, String newPassword) {

        User user = userRepository.findById(currentUser.getId())
                .orElseThrow();

        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new RuntimeException("Invalid password");
        }
        log.info("User: email={} changed their password", user.getEmail());
        user.setPasswordHash(passwordEncoder.encode(newPassword));

        userRepository.save(user);
    }

    @Transactional
    public boolean updateProfile(Long userId,
                                 String firstName,
                                 String middleName,
                                 String lastName) {

        User user = userRepository.findById(userId).orElseThrow();

        if (Objects.equals(user.getFirstName(), firstName)
                && Objects.equals(user.getMiddleName(), middleName)
                && Objects.equals(user.getLastName(), lastName)) {

            return false;
        }

        user.setFirstName(firstName);
        user.setMiddleName(middleName);
        user.setLastName(lastName);

        log.info("User {} updated profile", user.getEmail());

        return true;
    }



}
