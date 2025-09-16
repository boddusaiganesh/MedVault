// src/main/java/com/medvault/backend/dto/PatientProfileDTO.java
package com.medvault.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class PatientProfileDTO {
    private String firstName;
    private String lastName;
    private String email;
    private LocalDate dateOfBirth;
    private String contactNumber;
}