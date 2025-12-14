package com.bezkoder.springjwt.controllers;

import com.bezkoder.springjwt.models.User;
import com.bezkoder.springjwt.payload.request.ChangePasswordRequest;
import com.bezkoder.springjwt.payload.request.UpdateProfileRequest;
import com.bezkoder.springjwt.payload.response.MessageResponse;
import com.bezkoder.springjwt.payload.response.UserProfileResponse;
import com.bezkoder.springjwt.repository.UserRepository;
import com.bezkoder.springjwt.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            Optional<User> userOptional = userRepository.findById(userDetails.getId());

            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: User not found!"));
            }

            User user = userOptional.get();

            List<String> roles = user.getRoles().stream()
                    .map(role -> role.getName().toString())
                    .collect(Collectors.toList());

            UserProfileResponse response = new UserProfileResponse(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    roles);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@Valid @RequestBody UpdateProfileRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            Optional<User> userOptional = userRepository.findById(userDetails.getId());

            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: User not found!"));
            }

            User user = userOptional.get();

            // Check if username is being changed and if it's already taken
            if (!user.getUsername().equals(request.getUsername())) {
                if (userRepository.existsByUsername(request.getUsername())) {
                    return ResponseEntity.badRequest()
                            .body(new MessageResponse("Error: Username is already taken!"));
                }
                user.setUsername(request.getUsername());
            }

            // Check if email is being changed and if it's already in use
            if (!user.getEmail().equals(request.getEmail())) {
                if (userRepository.existsByEmail(request.getEmail())) {
                    return ResponseEntity.badRequest()
                            .body(new MessageResponse("Error: Email is already in use!"));
                }
                user.setEmail(request.getEmail());
            }

            userRepository.save(user);

            return ResponseEntity.ok(new MessageResponse("Profile updated successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            Optional<User> userOptional = userRepository.findById(userDetails.getId());

            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: User not found!"));
            }

            User user = userOptional.get();

            // Verify old password
            if (!encoder.matches(request.getOldPassword(), user.getPassword())) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Old password is incorrect!"));
            }

            // Validate new password is different
            if (request.getOldPassword().equals(request.getNewPassword())) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: New password must be different from old password!"));
            }

            // Update password
            user.setPassword(encoder.encode(request.getNewPassword()));
            userRepository.save(user);

            return ResponseEntity.ok(new MessageResponse("Password changed successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
}
