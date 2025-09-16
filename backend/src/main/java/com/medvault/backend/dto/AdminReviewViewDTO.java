// src/main/java/com/medvault/backend/dto/AdminReviewViewDTO.java
package com.medvault.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AdminReviewViewDTO {
    private Long ratingId;
    private int rating;
    private String review;
    private LocalDateTime createdAt;

    // Include both patient and doctor info
    private String patientName;
    private String patientEmail;
    private String doctorName;
    private String doctorSpecialization;
}