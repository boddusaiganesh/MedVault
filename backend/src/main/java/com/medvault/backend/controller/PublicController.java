// src/main/java/com/medvault/backend/controller/PublicController.java
package com.medvault.backend.controller;

import com.medvault.backend.dto.PublicDoctorViewDTO;
import com.medvault.backend.entity.Doctor;
import com.medvault.backend.entity.DoctorRating;
import com.medvault.backend.entity.VerificationStatus;
import com.medvault.backend.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import org.springframework.web.bind.annotation.PathVariable; // Add this import
import com.medvault.backend.repository.DoctorRatingRepository;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final DoctorRepository doctorRepository;
    private final DoctorRatingRepository ratingRepository; // Inject rating repo

 @GetMapping("/doctors/verified")
    public ResponseEntity<List<PublicDoctorViewDTO>> getAllVerifiedDoctors() {
        List<Doctor> verifiedDoctors = doctorRepository.findByVerificationStatus(VerificationStatus.VERIFIED);

        // For each doctor, calculate their average rating and count
        // In a high-traffic app, this would be optimized, but for here it's fine
        List<PublicDoctorViewDTO> dtoList = verifiedDoctors.stream()
                .map(doctor -> {
                    // This is a simplified calculation. A custom query would be more efficient.
                    Double avgRating = ratingRepository.findAll().stream()
                            .filter(rating -> rating.getDoctor().getId().equals(doctor.getId()))
                            .mapToInt(DoctorRating::getRating)
                            .average()
                            .orElse(0.0);
                    
                    long reviewCount = ratingRepository.findAll().stream()
                            .filter(rating -> rating.getDoctor().getId().equals(doctor.getId()))
                            .count();

                    return PublicDoctorViewDTO.builder()
                            .id(doctor.getId())
                            .firstName(doctor.getFirstName())
                            .lastName(doctor.getLastName())
                            .specialization(doctor.getSpecialization())
                            .experienceYears(doctor.getExperienceYears())
                            .averageRating(avgRating) // Include the calculated rating
                            .reviewCount(reviewCount)   // Include the count
                            .build();
                })
                .toList();
        
        return ResponseEntity.ok(dtoList);
    }

     // --- THIS IS THE NEW ENDPOINT ---
    @GetMapping("/doctors/{doctorId}")
    public ResponseEntity<PublicDoctorViewDTO> getDoctorById(@PathVariable Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // We only return the DTO if the doctor is verified
        if (doctor.getVerificationStatus() != VerificationStatus.VERIFIED) {
            // You can return a 404 or a specific error message
            return ResponseEntity.notFound().build();
        }

        // Reuse the same DTO as the list endpoint
        PublicDoctorViewDTO dto = PublicDoctorViewDTO.builder()
                .id(doctor.getId())
                .firstName(doctor.getFirstName())
                .lastName(doctor.getLastName())
                .specialization(doctor.getSpecialization())
                .experienceYears(doctor.getExperienceYears())
                .build();

        return ResponseEntity.ok(dto);
    }
}