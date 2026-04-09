package com.xxxpert.xyxarxpert.services;

import com.xxxpert.xyxarxpert.UserAlreadyExistsException;
import com.xxxpert.xyxarxpert.entities.User;
import com.xxxpert.xyxarxpert.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private void addUser(User user){
        userRepository.save(user);
    }

    public void registerUser(User user){
        if (user == null){
            throw new IllegalArgumentException("User is null");
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()){
            throw new UserAlreadyExistsException("User already exists");
        }

        user.setRegisteredAt(OffsetDateTime.now());
        user.setRole("user");
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        addUser(user);
    }

}
