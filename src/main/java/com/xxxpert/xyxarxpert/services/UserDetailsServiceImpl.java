package com.xxxpert.xyxarxpert.services;


import com.xxxpert.xyxarxpert.entities.User;
import com.xxxpert.xyxarxpert.entities.UserDetailsImpl;
import com.xxxpert.xyxarxpert.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Slf4j
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        log.debug("Attempt to load user by email: {}", email);

        return userRepository.findByEmail(email)
                .map(user -> {
                    log.debug("User found: email={}, id={}", user.getEmail(), user.getId());
                    return new UserDetailsImpl(user);
                })
                .orElseThrow(() -> {
                    log.warn("User not found during authentication: email={}", email);
                    return new UsernameNotFoundException("Invalid credentials");
                });
    }
}
