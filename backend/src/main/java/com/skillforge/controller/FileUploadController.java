package com.skillforge.controller;

import com.skillforge.dto.UploadResponse;
import com.skillforge.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

/**
 * FileUploadController
 * ====================
 * REST endpoints for uploading files to Cloudinary CDN.
 *
 * All endpoints require JWT authentication (via Authorization: Bearer <token> header).
 * No API keys are exposed to the frontend — Cloudinary credentials stay on the server.
 *
 * Base path: /api/upload
 *
 * Endpoints:
 *   POST   /api/upload/image     — upload image (all authenticated users)
 *   POST   /api/upload/video     — upload video (INSTRUCTOR or ADMIN only)
 *   POST   /api/upload/document  — upload document (all authenticated users)
 *   DELETE /api/upload/{publicId} — delete file (INSTRUCTOR or ADMIN only)
 *
 * Prerequisites:
 *   Set CLOUDINARY_ENABLED=true in environment variables.
 *   See application.properties for full configuration details.
 */
@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    @Autowired
    private CloudinaryService cloudinaryService;

    // -------------------------------------------------------------------------
    // IMAGE UPLOAD
    // Allowed: all authenticated users (students can upload profile pics, etc.)
    // Max size: configure in application.properties via spring.servlet.multipart.max-file-size
    // -------------------------------------------------------------------------

    /**
     * Upload an image file.
     * Accepted types: JPG, PNG, GIF, WebP, SVG
     *
     * @param file  the multipart image file
     * @return UploadResponse with CDN URL and metadata
     */
    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            UploadResponse response = cloudinaryService.uploadImage(file);
            return ResponseEntity.ok(response);
        } catch (IllegalStateException e) {
            // Cloudinary not configured
            return ResponseEntity.status(503).body(Map.of(
                "error", "File upload service not configured",
                "message", e.getMessage(),
                "hint", "Set CLOUDINARY_ENABLED=true and provide Cloudinary credentials"
            ));
        } catch (IllegalArgumentException e) {
            // Invalid file type
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Upload failed",
                "message", e.getMessage()
            ));
        }
    }

    // -------------------------------------------------------------------------
    // VIDEO UPLOAD
    // Restricted: only Instructors and Admins can upload course videos
    // -------------------------------------------------------------------------

    /**
     * Upload a video file for a course lesson.
     * Accepted types: MP4, MOV, AVI, WebM
     * Note: Large videos may take significant time to process.
     *
     * @param file  the multipart video file
     * @return UploadResponse with CDN URL and metadata
     */
    @PostMapping(value = "/video", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ROLE_INSTRUCTOR') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> uploadVideo(@RequestParam("file") MultipartFile file) {
        try {
            UploadResponse response = cloudinaryService.uploadVideo(file);
            return ResponseEntity.ok(response);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(503).body(Map.of(
                "error", "File upload service not configured",
                "message", e.getMessage(),
                "hint", "Set CLOUDINARY_ENABLED=true and provide Cloudinary credentials"
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Video upload failed",
                "message", e.getMessage()
            ));
        }
    }

    // -------------------------------------------------------------------------
    // DOCUMENT UPLOAD
    // Allowed: all authenticated users (course materials, assignments)
    // -------------------------------------------------------------------------

    /**
     * Upload a document file (PDF, DOCX, PPTX, XLSX).
     *
     * @param file  the multipart document file
     * @return UploadResponse with CDN URL and metadata
     */
    @PostMapping(value = "/document", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> uploadDocument(@RequestParam("file") MultipartFile file) {
        try {
            UploadResponse response = cloudinaryService.uploadDocument(file);
            return ResponseEntity.ok(response);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(503).body(Map.of(
                "error", "File upload service not configured",
                "message", e.getMessage(),
                "hint", "Set CLOUDINARY_ENABLED=true and provide Cloudinary credentials"
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Document upload failed",
                "message", e.getMessage()
            ));
        }
    }

    // -------------------------------------------------------------------------
    // DELETE FILE
    // Restricted: only Instructors and Admins can delete files
    // -------------------------------------------------------------------------

    /**
     * Delete a file from Cloudinary by its public ID.
     * The publicId is returned in the UploadResponse when a file is uploaded.
     *
     * @param publicId     the Cloudinary public ID (URL-encoded if needed)
     * @param resourceType "image", "video", or "raw" (default: "image")
     */
    @DeleteMapping("/{publicId}")
    @PreAuthorize("hasRole('ROLE_INSTRUCTOR') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> deleteFile(
            @PathVariable String publicId,
            @RequestParam(defaultValue = "image") String resourceType) {
        try {
            // Cloudinary public IDs use "/" as separator (e.g. "skillforge/images/abc123")
            // The path variable captures everything after /api/upload/
            cloudinaryService.deleteFile(publicId, resourceType);
            return ResponseEntity.ok(Map.of("message", "File deleted successfully", "publicId", publicId));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(503).body(Map.of("error", e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Delete failed",
                "message", e.getMessage()
            ));
        }
    }
}
