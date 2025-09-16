// src/main/java/com/medvault/backend/dto/PatientProfileDTO.java
package com.medvault.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

import com.medvault.backend.entity.Gender;

@Data
@Builder
public class PatientProfileDTO {
    private String firstName;
    private String lastName;
    private String email;
    private LocalDate dateOfBirth;
    private String contactNumber;
    private Gender gender;
    private String address;
    private String emergencyContact;
}