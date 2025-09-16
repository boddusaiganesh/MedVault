// src/main/java/com/medvault/backend/dto/PendingRegistrationViewDTO.java
package com.medvault.backend.dto;

import com.medvault.backend.entity.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PendingRegistrationViewDTO {
    private Long id;
    private String name;
    private String email;
    private Role requestedRole;
}