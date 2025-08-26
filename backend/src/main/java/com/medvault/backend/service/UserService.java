// src/main/java/com/medvault/backend/service/UserService.java
package com.medvault.backend.service;

import com.medvault.backend.dto.SetNewPasswordRequestDTO;
import com.medvault.backend.entity.User;
import com.medvault.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void setNewPassword(String userEmail, SetNewPasswordRequestDTO requestDTO) {
        System.out.println("--- UserService: setNewPassword method started ---");
        System.out.println("1. Attempting to find user with email: " + userEmail);

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        System.out.println("2. User found successfully: " + user.getName());
        System.out.println("3. Old password hash: " + user.getPassword());
        System.out.println("4. Old isFirstLogin flag: " + user.isFirstLogin());

        String newHashedPassword = passwordEncoder.encode(requestDTO.getNewPassword());
        System.out.println("5. New password hashed successfully: " + newHashedPassword);

        user.setPassword(newHashedPassword);
        user.setFirstLogin(false);

        System.out.println("6. User object updated in memory. Attempting to save...");

        userRepository.save(user);

        System.out.println("7. userRepository.save(user) method completed.");
        System.out.println("--- UserService: setNewPassword method finished ---");
    }
}