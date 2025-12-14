package com.bezkoder.springjwt.controllers;

import com.bezkoder.springjwt.models.ERole;
import com.bezkoder.springjwt.models.Role;
import com.bezkoder.springjwt.models.User;
import com.bezkoder.springjwt.payload.request.UpdateUserRolesRequest;
import com.bezkoder.springjwt.payload.response.AdminStatsResponse;
import com.bezkoder.springjwt.payload.response.MessageResponse;
import com.bezkoder.springjwt.payload.response.UserListResponse;
import com.bezkoder.springjwt.repository.RoleRepository;
import com.bezkoder.springjwt.repository.UserRepository;
import com.bezkoder.springjwt.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();

            List<UserListResponse> userList = users.stream()
                    .map(user -> {
                        List<String> roles = user.getRoles().stream()
                                .map(role -> role.getName().toString())
                                .collect(Collectors.toList());

                        return new UserListResponse(
                                user.getId(),
                                user.getUsername(),
                                user.getEmail(),
                                roles);
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(userList);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            Optional<User> userOptional = userRepository.findById(id);

            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: User not found!"));
            }

            User user = userOptional.get();
            List<String> roles = user.getRoles().stream()
                    .map(role -> role.getName().toString())
                    .collect(Collectors.toList());

            UserListResponse response = new UserListResponse(
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

    @PutMapping("/users/{id}/roles")
    public ResponseEntity<?> updateUserRoles(@PathVariable Long id,
            @Valid @RequestBody UpdateUserRolesRequest request) {
        try {
            Optional<User> userOptional = userRepository.findById(id);

            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: User not found!"));
            }

            User user = userOptional.get();
            Set<String> strRoles = request.getRoles();
            Set<Role> roles = new HashSet<>();

            if (strRoles == null || strRoles.isEmpty()) {
                Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                roles.add(userRole);
            } else {
                strRoles.forEach(role -> {
                    switch (role) {
                        case "ROLE_ADMIN":
                        case "admin":
                            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                            roles.add(adminRole);
                            break;
                        case "ROLE_MODERATOR":
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

            return ResponseEntity.ok(new MessageResponse("User roles updated successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            // Prevent admin from deleting themselves
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            if (userDetails.getId().equals(id)) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: You cannot delete your own account!"));
            }

            Optional<User> userOptional = userRepository.findById(id);

            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: User not found!"));
            }

            userRepository.deleteById(id);

            return ResponseEntity.ok(new MessageResponse("User deleted successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<?> getStatistics() {
        try {
            long totalUsers = userRepository.count();

            // Count users by role
            List<User> allUsers = userRepository.findAll();

            long adminCount = allUsers.stream()
                    .filter(user -> user.getRoles().stream()
                            .anyMatch(role -> role.getName() == ERole.ROLE_ADMIN))
                    .count();

            long moderatorCount = allUsers.stream()
                    .filter(user -> user.getRoles().stream()
                            .anyMatch(role -> role.getName() == ERole.ROLE_MODERATOR))
                    .count();

            long userCount = allUsers.stream()
                    .filter(user -> user.getRoles().stream()
                            .anyMatch(role -> role.getName() == ERole.ROLE_USER))
                    .count();

            AdminStatsResponse stats = new AdminStatsResponse(
                    totalUsers,
                    adminCount,
                    moderatorCount,
                    userCount);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    // Get all pending users (not approved)
    @GetMapping("/pending-users")
    public ResponseEntity<?> getPendingUsers() {
        try {
            List<User> pendingUsers = userRepository.findAll().stream()
                    .filter(user -> user.getApproved() == null || !user.getApproved())
                    .collect(Collectors.toList());

            List<UserListResponse> userList = pendingUsers.stream()
                    .map(user -> {
                        List<String> roles = user.getRoles().stream()
                                .map(role -> role.getName().toString())
                                .collect(Collectors.toList());

                        return new UserListResponse(
                                user.getId(),
                                user.getUsername(),
                                user.getEmail(),
                                roles);
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(userList);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    // Approve user
    @PostMapping("/approve-user/{userId}")
    public ResponseEntity<?> approveUser(@PathVariable Long userId) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);

            if (userOptional.isEmpty()) {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: User not found!"));
            }

            User user = userOptional.get();
            user.setApproved(true);
            userRepository.save(user);

            return ResponseEntity.ok(new MessageResponse("User approved successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    // Reject user (delete)
    @DeleteMapping("/reject-user/{userId}")
    public ResponseEntity<?> rejectUser(@PathVariable Long userId) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);

            if (userOptional.isEmpty()) {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: User not found!"));
            }

            userRepository.deleteById(userId);
            return ResponseEntity.ok(new MessageResponse("User rejected and deleted!"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
}