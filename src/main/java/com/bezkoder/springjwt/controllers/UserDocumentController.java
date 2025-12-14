package com.bezkoder.springjwt.controllers;

import com.bezkoder.springjwt.models.User;
import com.bezkoder.springjwt.models.UserDocument;
import com.bezkoder.springjwt.payload.request.CreateDocumentRequest;
import com.bezkoder.springjwt.payload.response.DocumentResponse;
import com.bezkoder.springjwt.payload.response.MessageResponse;
import com.bezkoder.springjwt.repository.UserDocumentRepository;
import com.bezkoder.springjwt.repository.UserRepository;
import com.bezkoder.springjwt.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user/documents")
public class UserDocumentController {

    @Autowired
    private UserDocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;

    private static final String UPLOAD_DIR = "uploads/user-documents/";

    // Get all documents for current user
    @GetMapping
    public ResponseEntity<?> getUserDocuments() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            List<UserDocument> documents = documentRepository.findByUserIdOrderByCreatedAtDesc(userDetails.getId());

            List<DocumentResponse> response = documents.stream()
                    .map(doc -> new DocumentResponse(
                            doc.getId(),
                            doc.getTitle(),
                            doc.getContent(),
                            doc.getDocumentType(),
                            doc.getFileName(),
                            doc.getFilePath(),
                            doc.getFileSize(),
                            doc.getMimeType(),
                            doc.getCreatedAt(),
                            doc.getUpdatedAt()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    // Create a new note
    @PostMapping("/note")
    public ResponseEntity<?> createNote(@Valid @RequestBody CreateDocumentRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            Optional<User> userOptional = userRepository.findById(userDetails.getId());
            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: User not found!"));
            }

            UserDocument document = new UserDocument();
            document.setUser(userOptional.get());
            document.setTitle(request.getTitle());
            document.setContent(request.getContent());
            document.setDocumentType("NOTE");

            documentRepository.save(document);

            return ResponseEntity.ok(new MessageResponse("Note created successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    // Upload a file/image
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            Optional<User> userOptional = userRepository.findById(userDetails.getId());
            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: User not found!"));
            }

            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Please select a file!"));
            }

            // Create upload directory with absolute path
            Path uploadPath = Paths.get("uploads", "user-documents").toAbsolutePath();
            File uploadDir = uploadPath.toFile();
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(filename);

            // Save file
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Determine document type
            String mimeType = file.getContentType();
            String documentType = "FILE";
            if (mimeType != null && mimeType.startsWith("image/")) {
                documentType = "IMAGE";
            }

            // Save document record - ONLY SAVE THE FILENAME, NOT ABSOLUTE PATH
            UserDocument document = new UserDocument();
            document.setUser(userOptional.get());
            document.setTitle(title);
            document.setDocumentType(documentType);
            document.setFileName(originalFilename);
            document.setFilePath(filename); // Only save filename, not full path
            document.setFileSize(file.getSize());
            document.setMimeType(mimeType);

            documentRepository.save(document);

            return ResponseEntity.ok(new MessageResponse("File uploaded successfully!"));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(new MessageResponse("Error uploading file: " + e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    // Serve uploaded files
    @GetMapping("/files/{filename}")
    public ResponseEntity<?> serveFile(@PathVariable String filename) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            // Find document to verify ownership
            Optional<UserDocument> documentOptional = documentRepository
                    .findByUserIdOrderByCreatedAtDesc(userDetails.getId())
                    .stream()
                    .filter(doc -> doc.getFilePath() != null && doc.getFilePath().equals(filename))
                    .findFirst();

            if (documentOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Load file
            Path uploadPath = Paths.get("uploads", "user-documents").toAbsolutePath();
            Path filePath = uploadPath.resolve(filename);

            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            byte[] fileContent = Files.readAllBytes(filePath);

            // Determine content type
            String contentType = documentOptional.get().getMimeType();
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(org.springframework.http.MediaType.parseMediaType(contentType))
                    .body(fileContent);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    // Update a document
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDocument(
            @PathVariable Long id,
            @Valid @RequestBody CreateDocumentRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            Optional<UserDocument> documentOptional = documentRepository.findById(id);
            if (documentOptional.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Document not found!"));
            }

            UserDocument document = documentOptional.get();

            // Check if document belongs to current user
            if (!document.getUser().getId().equals(userDetails.getId())) {
                return ResponseEntity.status(403)
                        .body(new MessageResponse("Error: Unauthorized!"));
            }

            document.setTitle(request.getTitle());
            document.setContent(request.getContent());

            documentRepository.save(document);

            return ResponseEntity.ok(new MessageResponse("Document updated successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    // Delete a document
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDocument(@PathVariable Long id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            Optional<UserDocument> documentOptional = documentRepository.findById(id);
            if (documentOptional.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Document not found!"));
            }

            UserDocument document = documentOptional.get();

            // Check if document belongs to current user
            if (!document.getUser().getId().equals(userDetails.getId())) {
                return ResponseEntity.status(403)
                        .body(new MessageResponse("Error: Unauthorized!"));
            }

            // Delete file if exists
            if (document.getFilePath() != null) {
                try {
                    Files.deleteIfExists(Paths.get(document.getFilePath()));
                } catch (IOException e) {
                    // Log error but continue with database deletion
                    System.err.println("Error deleting file: " + e.getMessage());
                }
            }

            documentRepository.delete(document);

            return ResponseEntity.ok(new MessageResponse("Document deleted successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    // Get document count
    @GetMapping("/count")
    public ResponseEntity<?> getDocumentCount() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            Long count = documentRepository.countByUserId(userDetails.getId());

            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
}
