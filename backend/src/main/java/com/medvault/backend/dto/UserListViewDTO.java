// src/main/java/com/medvault/backend/dto/UserListViewDTO.java
package com.medvault.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class UserListViewDTO {
    private Long id; // This will be the Patient/Doctor ID, not the User ID
    private String name;
    private String email;
    private String contactNumber;
    private LocalDateTime createdAt; // We need to add createdAt to User entity
}