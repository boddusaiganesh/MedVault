package com.medvault.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendTemporaryPasswordEmail(String toEmail, String username, String temporaryPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@medvault.com");
        message.setTo(toEmail);
        message.setSubject("Your MedVault Account Credentials");
        message.setText("Welcome to MedVault!\n\n"
                + "An account has been created for you.\n\n"
                + "Username: " + username + "\n"
                + "Temporary Password: " + temporaryPassword + "\n\n"
                + "Please use this password for your first login. You will be required to set a new password immediately.");
        mailSender.send(message);
    }
}