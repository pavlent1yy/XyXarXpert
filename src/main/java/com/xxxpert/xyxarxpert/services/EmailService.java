package com.xxxpert.xyxarxpert.services;

import com.xxxpert.xyxarxpert.entities.EmailVerificationCode;
import com.xxxpert.xyxarxpert.entities.ForgotPasswordRequest;
import com.xxxpert.xyxarxpert.entities.PasswordResetToken;
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


import javax.swing.text.html.Option;
import java.time.OffsetDateTime;
import java.util.Optional;


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
        sendVerificationMail(email);
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

    public void sendVerificationMail(String email){
        SimpleMailMessage congratulations = new SimpleMailMessage();

        congratulations.setFrom(fromEmail);
        congratulations.setTo(email);
        congratulations.setSubject("Подздравляю!");
        congratulations.setText("""
                Подздравляем!
                Вы успешно подтвердили вашу почту!
                """);
        mailSender.send(congratulations);
    }

    public void sendResetToken(String email, String token){

        SimpleMailMessage passwordReset = new SimpleMailMessage();

        passwordReset.setFrom(fromEmail);
        passwordReset.setTo(email);

        passwordReset.setSubject("Сброс пароля!");

        passwordReset.setText("""
        Ваша персональная ссылка на сброс пароля:

        http://localhost:1212/auth/reset-password?token=%s

        Ссылка действует 15 минут.
        """.formatted(token));

        mailSender.send(passwordReset);
    }

    public void sendRepairStartNotification(String email, String streamlink, User master){
        SimpleMailMessage passwordReset = new SimpleMailMessage();

        passwordReset.setFrom(fromEmail);
        passwordReset.setTo(email);

        passwordReset.setSubject("Начался Ремонт!");

        passwordReset.setText("""
        Мастер %s %s %s уже начал ремонт!
        Скорее заходите на стрим:

        %s
        
        """.formatted(
                master.getFirstName(),
                master.getMiddleName(),
                master.getLastName(),
                streamlink));

        mailSender.send(passwordReset);
    }

    public void sendRepairTakenNotification(String email, User master){
        SimpleMailMessage passwordReset = new SimpleMailMessage();

        passwordReset.setFrom(fromEmail);
        passwordReset.setTo(email);

        passwordReset.setSubject("Вашу заявку взял мастер");

        passwordReset.setText(
                """
                Мастер %s %s %s
                Если возникнут вопросы, можно написать мастеру на рабочую почту: %s
                Также можно написать на почту тех. поддержки: xyxarexpert@outlook.com
                """.formatted(
                        master.getFirstName(),
                        master.getMiddleName(),
                        master.getLastName(),
                        master.getEmail()
                )
        );

        mailSender.send(passwordReset);
    }


}
