// src/main/java/com/medvault/backend/dto/PublicDoctorViewDTO.java
package com.medvault.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PublicDoctorViewDTO {
    private Long id; // The DOCTOR's ID, not the user ID
    private String firstName;
    private String lastName;
    private String specialization;
    private Integer experienceYears;
        // --- NEW FIELDS ---
    private Double averageRating;
    private Long reviewCount;
}