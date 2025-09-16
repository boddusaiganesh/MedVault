// src/main/java/com/medvault/backend/controller/PatientController.java
package com.medvault.backend.controller;

import com.medvault.backend.dto.PatientProfileDTO;
import com.medvault.backend.entity.Patient;
import com.medvault.backend.entity.User;
import com.medvault.backend.repository.PatientRepository;
import com.medvault.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/patient")
@RequiredArgsConstructor
public class PatientController {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;

    @GetMapping("/profile/me")
    public ResponseEntity<PatientProfileDTO> getMyProfile(Principal principal) {
        // Spring Security gives us the logged-in user's email via the Principal
        String email = principal.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Patient patient = patientRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));

        // Map the entity data to a DTO to send to the frontend
        PatientProfileDTO profileDTO = PatientProfileDTO.builder()
                .firstName(patient.getFirstName())
                .lastName(patient.getLastName())
                .email(user.getEmail())
                .dateOfBirth(patient.getDateOfBirth())
                .contactNumber(patient.getContactNumber())
                .build();

        return ResponseEntity.ok(profileDTO);
    }
}