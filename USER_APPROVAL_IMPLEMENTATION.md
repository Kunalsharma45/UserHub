# User Approval Workflow Implementation Guide

## Overview
This feature requires admin approval before new users can login.

## Changes Made So Far

### ✅ 1. User Model Updated
Added `approved` field to track approval status:
- File: `src/main/java/com/bezkoder/springjwt/models/User.java`
- Added field: `private Boolean approved = false;`
- Added getter and setter methods

## Manual Changes Required

### 2. Update AuthController Login Method

**File:** `src/main/java/com/bezkoder/springjwt/controllers/AuthController.java`

**Find the `signin` method (around line 66-85) and modify it:**

**Current code:**
```java
@PostMapping("/signin")
public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

  Authentication authentication = authenticationManager.authenticate(
      new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

  SecurityContextHolder.getContext().setAuthentication(authentication);
  String jwt = jwtUtils.generateJwtToken(authentication);

  UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
  List<String> roles = userDetails.getAuthorities().stream()
      .map(item -> item.getAuthority())
      .collect(Collectors.toList());

  return ResponseEntity.ok(new JwtResponse(jwt,
      userDetails.getId(),
      userDetails.getUsername(),
      userDetails.getEmail(),
      roles));
}
```

**Replace with:**
```java
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
```

### 3. Update Signup to Set Approved = False

**File:** `src/main/java/com/bezkoder/springjwt/controllers/AuthController.java`

**Find the `signup` method (around line 87-140) and modify the success message:**

**Find this line (around line 139):**
```java
return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
```

**Replace with:**
```java
return ResponseEntity.ok(new MessageResponse("User registered successfully! Your account is pending admin approval."));
```

### 4. Create Admin Controller for User Approval

**Create new file:** `src/main/java/com/bezkoder/springjwt/controllers/AdminController.java`

```java
package com.bezkoder.springjwt.controllers;

import com.bezkoder.springjwt.models.User;
import com.bezkoder.springjwt.payload.response.MessageResponse;
import com.bezkoder.springjwt.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    UserRepository userRepository;

    // Get all pending users (not approved)
    @GetMapping("/pending-users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getPendingUsers() {
        List<User> pendingUsers = userRepository.findAll().stream()
                .filter(user -> user.getApproved() == null || !user.getApproved())
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(pendingUsers);
    }

    // Get all users
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    // Approve user
    @PostMapping("/approve-user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveUser(@PathVariable Long userId) {
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
    }

    // Reject/Delete user
    @DeleteMapping("/reject-user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> rejectUser(@PathVariable Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: User not found!"));
        }

        userRepository.deleteById(userId);
        return ResponseEntity.ok(new MessageResponse("User rejected and deleted!"));
    }
}
```

### 5. Update Existing Admin Users

Since you're adding a new field, existing users in the database won't have the `approved` field set.

**Option A: Update via SQL (Recommended for existing admins)**
```sql
-- Approve all existing users (run this once)
UPDATE users SET approved = true;

-- Or approve only admins
UPDATE users u
INNER JOIN user_roles ur ON u.id = ur.user_id
INNER JOIN roles r ON ur.role_id = r.id
SET u.approved = true
WHERE r.name = 'ROLE_ADMIN';
```

**Option B: Update via code (add to AuthController temporarily)**
```java
// Add this endpoint temporarily, call it once, then remove it
@PostMapping("/approve-all-existing")
public ResponseEntity<?> approveAllExisting() {
    List<User> users = userRepository.findAll();
    for (User user : users) {
        if (user.getApproved() == null) {
            user.setApproved(true);
            userRepository.save(user);
        }
    }
    return ResponseEntity.ok(new MessageResponse("All existing users approved!"));
}
```

## Frontend Changes Needed

### 1. Update Registration Success Message
Show message: "Registration successful! Please wait for admin approval before logging in."

### 2. Update Login Error Handling
Handle 403 status and show: "Your account is pending admin approval."

### 3. Create Admin User Management Page
- Show list of pending users
- Approve/Reject buttons for each user
- Show user details (username, email, roles, registration date)

## Testing the Feature

### Step 1: Approve Existing Users
1. Run SQL: `UPDATE users SET approved = true;`
2. Or create and call the temporary endpoint

### Step 2: Test New Registration
1. Register a new user
2. Try to login → Should see "pending approval" message
3. Login as admin
4. Go to admin panel → See pending users
5. Approve the user
6. Try to login again → Should work now!

## API Endpoints Summary

| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| `/api/admin/pending-users` | GET | Admin | Get all unapproved users |
| `/api/admin/users` | GET | Admin | Get all users |
| `/api/admin/approve-user/{id}` | POST | Admin | Approve a user |
| `/api/admin/reject-user/{id}` | DELETE | Admin | Reject and delete user |

## Next Steps

1. ✅ User model updated (done automatically)
2. ⚠️ Update AuthController signin method (manual - see above)
3. ⚠️ Update AuthController signup message (manual - see above)
4. ⚠️ Create AdminController (manual - see above)
5. ⚠️ Approve existing users via SQL (manual - see above)
6. ⚠️ Update frontend (manual - create admin UI)
7. ⚠️ Restart backend and test

Would you like me to create the frontend components for the admin user management page?
