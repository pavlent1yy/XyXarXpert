package com.xxxpert.xyxarxpert.services;

import com.xxxpert.xyxarxpert.UserAlreadyExistsException;
import com.xxxpert.xyxarxpert.entities.EmailVerificationCode;
import com.xxxpert.xyxarxpert.entities.RegisterRequest;
import com.xxxpert.xyxarxpert.entities.User;
import com.xxxpert.xyxarxpert.repositories.UserRepository;
import com.xxxpert.xyxarxpert.repositories.VerificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final VerificationRepository verificationRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Value("${app.email-verification}")
    private boolean emailVerificationEnabled;

    public String generateCode() {
        return String.valueOf((int)(Math.random() * 900000) + 100000);
    }

    public void registerUser(RegisterRequest request){
        if (userRepository.findByEmail(request.getEmail()).isPresent()){
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

        userRepository.save(user);

        if (emailVerificationEnabled) {
            String code = generateCode();

            EmailVerificationCode evc = new EmailVerificationCode();
            evc.setEmail(user.getEmail());
            evc.setCode(code);
            evc.setExpiresAt(OffsetDateTime.now().plusMinutes(10));

            verificationRepository.save(evc);
            emailService.sendCode(user.getEmail(), code);
        } else {
            user.setEnabled(true);
        }
    }



}
