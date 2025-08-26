// src/main/java/com/medvault/backend/controller/AdminController.java

package com.medvault.backend.controller;

import com.medvault.backend.dto.CreateUserRequestDTO;
import com.medvault.backend.entity.Patient;
import com.medvault.backend.entity.Role; 
import com.medvault.backend.entity.User;
import com.medvault.backend.entity.Doctor;
import com.medvault.backend.repository.DoctorRepository;

import com.medvault.backend.repository.PatientRepository;
import com.medvault.backend.repository.UserRepository;
import com.medvault.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.SecureRandom;
import java.util.Base64;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

  
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @PostMapping("/create-user")
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequestDTO requestDTO) {
       
        if (userRepository.findByEmail(requestDTO.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

     
        String tempPassword = generateRandomPassword();

    
        User newUser = User.builder()
                .name(requestDTO.getName())
                .email(requestDTO.getEmail())
                .password(passwordEncoder.encode(tempPassword))
                .role(requestDTO.getRole())
                .isFirstLogin(true)
                .build();

        User savedUser = userRepository.save(newUser);

       
        if (savedUser.getRole() == Role.ROLE_USER) {
        
            Patient newPatientProfile = Patient.builder()
                    .user(savedUser) 
                    .firstName(savedUser.getName()) 
                    .lastName("")
                   
                    .build();
            
            
            patientRepository.save(newPatientProfile);
            
        }        else if (savedUser.getRole() == Role.ROLE_DOCTOR) {
            Doctor newDoctorProfile = Doctor.builder()
                    .user(savedUser)
                    .firstName(savedUser.getName())
                    .lastName("")
                    .build();
            doctorRepository.save(newDoctorProfile);
        }

       
        emailService.sendTemporaryPasswordEmail(savedUser.getEmail(), savedUser.getUsername(), tempPassword);

        return ResponseEntity.ok("User registered successfully! Temporary password sent to email.");
    }

    
    private String generateRandomPassword() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[12];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}