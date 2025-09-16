package com.medvault.backend.dto;
import lombok.Data;
@Data
public class UpdateDoctorProfileDTO {
    private String firstName;
    private String lastName;
    private String specialization;
    private String qualification;
    private String contactNumber;
    private Integer experienceYears;
}