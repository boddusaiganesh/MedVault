// src/main/java/com/medvault/backend/dto/DoctorReviewViewDTO.java
package com.medvault.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class DoctorReviewViewDTO {
    private Long id;
    private int rating;
    private String review;
    private LocalDateTime createdAt;
    private String patientFirstName;
    private String patientLastName;
}