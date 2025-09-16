// src/main/java/com/medvault/backend/dto/DoctorVerificationDTO.java
package com.medvault.backend.dto;

import com.medvault.backend.entity.VerificationStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DoctorVerificationDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String specialization;
    private String qualification;
    private VerificationStatus verificationStatus;
    private String userEmail; // We'll get the email from the User object
}