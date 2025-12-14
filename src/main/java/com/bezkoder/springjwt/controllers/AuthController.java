package com.bezkoder.springjwt.controllers;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bezkoder.springjwt.models.ERole;
import com.bezkoder.springjwt.models.Role;
import com.bezkoder.springjwt.models.User;
import com.bezkoder.springjwt.payload.request.LoginRequest;
import com.bezkoder.springjwt.payload.request.SignupRequest;
import com.bezkoder.springjwt.payload.response.JwtResponse;
import com.bezkoder.springjwt.payload.response.MessageResponse;
import com.bezkoder.springjwt.repository.RoleRepository;
import com.bezkoder.springjwt.repository.UserRepository;
import com.bezkoder.springjwt.security.jwt.JwtUtils;
import com.bezkoder.springjwt.security.services.UserDetailsImpl;
import com.bezkoder.springjwt.service.EmailService;
import com.bezkoder.springjwt.service.OtpService;
import com.bezkoder.springjwt.payload.request.ForgotPasswordRequest;
import com.bezkoder.springjwt.payload.request.VerifyOtpRequest;
import com.bezkoder.springjwt.payload.request.ResetPasswordRequest;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JwtUtils jwtUtils;

  @Autowired
  EmailService emailService;

  @Autowired
  OtpService otpService;

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

    // Check if user is approved
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    Optional<User> userOptional = userRepository.findById(userDetails.getId());
    
    if (userOptional.isPresent()) {
      User user = userOptional.get();
      if (user.getApproved() == null || !user.getApproved()) {
        return ResponseEntity
            .status(403)
            .body(new MessageResponse("Your account is pending admin approval. Please wait for approval before logging in."));
      }
    }

    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = jwtUtils.generateJwtToken(authentication);

    List<String> roles = userDetails.getAuthorities().stream()
        .map(item -> item.getAuthority())
        .collect(Collectors.toList());

    return ResponseEntity.ok(new JwtResponse(jwt,
        userDetails.getId(),
        userDetails.getUsername(),
        userDetails.getEmail(),
        roles));
  }

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
    if (userRepository.existsByUsername(signUpRequest.getUsername())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Username is already taken!"));
    }

    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Email is already in use!"));
    }

    // Create new user's account
    User user = new User(signUpRequest.getUsername(),
        signUpRequest.getEmail(),
        encoder.encode(signUpRequest.getPassword()));

    Set<String> strRoles = signUpRequest.getRole();
    Set<Role> roles = new HashSet<>();

    if (strRoles == null) {
      Role userRole = roleRepository.findByName(ERole.ROLE_USER)
          .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
      roles.add(userRole);
    } else {
      strRoles.forEach(role -> {
        switch (role) {
          case "admin":
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(adminRole);

            break;
          case "mod":
            Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(modRole);

            break;
          default:
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        }
      });
    }

    user.setRoles(roles);
    userRepository.save(user);

    return ResponseEntity.ok(new MessageResponse("User registered successfully! Your account is pending admin approval."));
  }

  @PostMapping("/forgot-password")
  public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
    Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

    if (userOptional.isEmpty()) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Email not found!"));
    }

    User user = userOptional.get();
    String otpCode = otpService.generateOTP();
    otpService.saveOTP(user.getId(), otpCode);

    // Check if email sending fails, but don't block the response entirely, or do?
    // Better to handle exception inside service or here.
    try {
      emailService.sendOtpEmail(user.getEmail(), otpCode);
    } catch (Exception e) {
      System.out.println("Email not configured. OTP for testing: " + otpCode + " (Email: " + user.getEmail() + ")");
    }

    return ResponseEntity.ok(new MessageResponse("OTP sent to your email!"));
  }

  @PostMapping("/verify-otp")
  public ResponseEntity<?> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
    Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

    if (userOptional.isEmpty()) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Email not found!"));
    }

    User user = userOptional.get();

    if (otpService.validateOTP(user.getId(), request.getOtpCode())) {
      return ResponseEntity.ok(new MessageResponse("OTP verified successfully!"));
    } else {
      return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid or expired OTP!"));
    }
  }

  @PostMapping("/reset-password")
  public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
    Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

    if (userOptional.isEmpty()) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Email not found!"));
    }

    User user = userOptional.get();

    // Verify OTP again just in case (or rely on client flow? Safer to verify)
    // OtpService.validateOTP marks as verified. OtpService.findVerifiedOtp checks
    // if verified.
    // If verify-otp was called, it is marked verified.
    // We should check if there is a verified OTP for this user.

    var otpOptional = otpService.findVerifiedOtp(user.getId());
    if (otpOptional.isEmpty() || !otpOptional.get().getVerified()
        || !otpOptional.get().getOtpCode().equals(request.getOtpCode())) {
      return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid or unverified OTP request!"));
    }

    // Update password
    user.setPassword(encoder.encode(request.getNewPassword()));
    userRepository.save(user);

    // Clean up OTP
    otpService.deleteOTP(user.getId());

    return ResponseEntity.ok(new MessageResponse("Password reset successfully!"));
  }
}
