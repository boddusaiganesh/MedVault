// src/main/java/com/medvault/backend/dto/DoctorProfileDTO.java
package com.medvault.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DoctorProfileDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String specialization;
    private String qualification;
    private Integer experienceYears;
    private String contactNumber;
}