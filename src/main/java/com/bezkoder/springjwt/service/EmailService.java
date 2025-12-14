package com.bezkoder.springjwt.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otpCode) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Password Reset OTP - User Management System");
            message.setText("Your OTP for password reset is: " + otpCode + "\n\n" +
                    "This OTP will expire in 10 minutes.\n\n" +
                    "If you didn't request this, please ignore this email.\n\n" +
                    "Best regards,\nUser Management System");

            mailSender.send(message);
            System.out.println("OTP email sent successfully to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send OTP email: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to send email", e);
        }
    }
}
