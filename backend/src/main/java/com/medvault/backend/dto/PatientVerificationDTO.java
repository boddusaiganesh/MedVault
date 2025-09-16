// src/main/java/com/medvault/backend/dto/PatientVerificationDTO.java
package com.medvault.backend.dto;

import com.medvault.backend.entity.VerificationStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PatientVerificationDTO {
    private Long id; // This is the Patient ID, not the User ID
    private String firstName;
    private String lastName;
    private String userEmail;
    private VerificationStatus verificationStatus;
}