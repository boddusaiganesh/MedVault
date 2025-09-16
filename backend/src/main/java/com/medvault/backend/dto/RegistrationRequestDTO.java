// src/main/java/com/medvault/backend/dto/RegistrationRequestDTO.java
package com.medvault.backend.dto;

import com.medvault.backend.entity.Role;
import lombok.Data;

@Data
public class RegistrationRequestDTO {
    private String name;
    private Integer age;
    private String email;
    private String phoneNumber;
    private Role requestedRole; // Will be either ROLE_USER or ROLE_DOCTOR
}