// src/main/java/com/medvault/backend/dto/SubmitRatingDTO.java
package com.medvault.backend.dto;
import lombok.Data;
@Data
public class SubmitRatingDTO {
    private int rating;
    private String review;
}