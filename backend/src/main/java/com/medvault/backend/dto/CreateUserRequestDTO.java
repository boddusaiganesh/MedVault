package com.medvault.backend.dto;

import com.medvault.backend.entity.Role;
import lombok.Data;

@Data
public class CreateUserRequestDTO {
    private String name;
    private String email;
    private Role role;
}