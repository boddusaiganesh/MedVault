package com.medvault.backend.controller;

import com.medvault.backend.dto.AuthResponseDTO;
import com.medvault.backend.dto.LoginRequestDTO;
import com.medvault.backend.dto.SetNewPasswordRequestDTO;
import com.medvault.backend.entity.User;
import com.medvault.backend.repository.UserRepository;
import com.medvault.backend.security.JwtUtil;
import com.medvault.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        final User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        String token = jwtUtil.generateToken(user);

        return ResponseEntity.ok(
                AuthResponseDTO.builder()
                        .token(token)
                        .role(user.getRole())
                        .isFirstLogin(user.isFirstLogin())
                        .build()
        );
    }

    @PostMapping("/set-new-password")
    public ResponseEntity<?> setNewPassword(@RequestBody SetNewPasswordRequestDTO request, Principal principal) {
        // 'Principal' is securely injected by Spring Security and contains the logged-in user's name (email)
        userService.setNewPassword(principal.getName(), request);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Password updated successfully. Please log in again.");
        return ResponseEntity.ok(response);
    }
}