// src/main/java/com/medvault/backend/controller/DoctorController.java
package com.medvault.backend.controller;

import com.medvault.backend.dto.DoctorProfileDTO;
import com.medvault.backend.entity.Doctor;
import com.medvault.backend.entity.User;
import com.medvault.backend.repository.DoctorRepository;
import com.medvault.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/doctor")
@RequiredArgsConstructor
public class DoctorController {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;

    @GetMapping("/profile/me")
    public ResponseEntity<DoctorProfileDTO> getMyProfile(Principal principal) {
        String email = principal.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Doctor doctor = doctorRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

        DoctorProfileDTO profileDTO = DoctorProfileDTO.builder()
                .firstName(doctor.getFirstName())
                .lastName(doctor.getLastName())
                .email(user.getEmail())
                .specialization(doctor.getSpecialization())
                .qualification(doctor.getQualification())
                .experienceYears(doctor.getExperienceYears())
                .build();

        return ResponseEntity.ok(profileDTO);
    }
}