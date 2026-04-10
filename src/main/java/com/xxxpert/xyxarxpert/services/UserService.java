package com.xxxpert.xyxarxpert.services;

import com.xxxpert.xyxarxpert.UserAlreadyExistsException;
import com.xxxpert.xyxarxpert.entities.RegisterRequest;
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

        userRepository.save(user);
    }

}
