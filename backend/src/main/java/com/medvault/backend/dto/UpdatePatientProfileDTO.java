package com.medvault.backend.dto;
import com.medvault.backend.entity.Gender;
import lombok.Data;
import java.time.LocalDate;
@Data
public class UpdatePatientProfileDTO {
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String contactNumber;
    private String address;
    private String emergencyContact;
}