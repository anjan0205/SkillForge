package com.skillforge.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.skillforge.config.CloudinaryConfig;
import com.skillforge.dto.UploadResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

/**
 * CloudinaryService
 * =================
 * Handles all file operations with Cloudinary CDN.
 *
 * Supported upload types:
 *   - Images  → stored in "skillforge/images/"   folder
 *   - Videos  → stored in "skillforge/videos/"   folder
 *   - Documents → stored in "skillforge/docs/"   folder
 *
 * Prerequisites:
 *   Set CLOUDINARY_ENABLED=true and provide:
 *     CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 */
@Service
public class CloudinaryService {

    private static final Logger logger = LoggerFactory.getLogger(CloudinaryService.class);

    // Base folder in Cloudinary — all SkillForge assets are organized under this
    private static final String BASE_FOLDER = "skillforge";

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private CloudinaryConfig cloudinaryConfig;

    // -------------------------------------------------------------------------
    // UPLOAD METHODS
    // -------------------------------------------------------------------------

    /**
     * Upload an image file (JPG, PNG, GIF, WebP, SVG).
     * Returns an UploadResponse with the CDN URL and metadata.
     *
     * @throws IllegalStateException if Cloudinary is not enabled/configured
     */
    public UploadResponse uploadImage(MultipartFile file) throws IOException {
        checkEnabled();
        validateFileType(file, new String[]{"image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"});

        Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "folder", BASE_FOLDER + "/images",
                "resource_type", "image",
                // Automatically apply quality optimization and format selection
                "quality", "auto",
                "fetch_format", "auto"
        ));

        logger.info("Image uploaded to Cloudinary: {}", result.get("public_id"));
        return buildResponse(result, "skillforge/images");
    }

    /**
     * Upload a video file (MP4, MOV, AVI, WebM).
     * Only Instructors and Admins should call this endpoint.
     *
     * Note: Large video uploads may take time. Consider chunked uploads for files > 100MB.
     */
    public UploadResponse uploadVideo(MultipartFile file) throws IOException {
        checkEnabled();
        validateFileType(file, new String[]{"video/mp4", "video/quicktime", "video/x-msvideo", "video/webm"});

        Map<?, ?> result = cloudinary.uploader().uploadLarge(file.getInputStream(), ObjectUtils.asMap(
                "folder", BASE_FOLDER + "/videos",
                "resource_type", "video",
                // Eager transformations: create a thumbnail for the video
                "eager", "c_fill,h_360,w_640/f_jpg",
                "eager_async", true
        ));

        logger.info("Video uploaded to Cloudinary: {}", result.get("public_id"));
        return buildResponse(result, "skillforge/videos");
    }

    /**
     * Upload a document file (PDF, DOCX, PPTX, XLSX).
     * Stored as "raw" resource type in Cloudinary.
     */
    public UploadResponse uploadDocument(MultipartFile file) throws IOException {
        checkEnabled();
        validateFileType(file, new String[]{
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.ms-powerpoint",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });

        Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "folder", BASE_FOLDER + "/docs",
                "resource_type", "raw"  // documents are stored as "raw" in Cloudinary
        ));

        logger.info("Document uploaded to Cloudinary: {}", result.get("public_id"));
        return buildResponse(result, "skillforge/docs");
    }

    // -------------------------------------------------------------------------
    // DELETE METHOD
    // -------------------------------------------------------------------------

    /**
     * Delete a file from Cloudinary by its publicId.
     * Call this when a course/lesson is deleted to clean up storage.
     *
     * @param publicId  The Cloudinary public_id returned at upload time
     * @param resourceType "image", "video", or "raw" (for documents)
     */
    public void deleteFile(String publicId, String resourceType) throws IOException {
        checkEnabled();
        Map<?, ?> result = cloudinary.uploader().destroy(publicId, ObjectUtils.asMap(
                "resource_type", resourceType != null ? resourceType : "image"
        ));
        logger.info("Cloudinary delete result for {}: {}", publicId, result.get("result"));
    }

    // -------------------------------------------------------------------------
    // HELPERS
    // -------------------------------------------------------------------------

    private void checkEnabled() {
        if (!cloudinaryConfig.isEnabled()) {
            throw new IllegalStateException(
                "Cloudinary is not configured. " +
                "Set CLOUDINARY_ENABLED=true and provide CLOUDINARY_CLOUD_NAME, " +
                "CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET environment variables."
            );
        }
    }

    private void validateFileType(MultipartFile file, String[] allowedTypes) {
        String contentType = file.getContentType();
        for (String allowed : allowedTypes) {
            if (allowed.equals(contentType)) return;
        }
        throw new IllegalArgumentException(
            "File type '" + contentType + "' is not allowed. " +
            "Allowed types: " + String.join(", ", allowedTypes)
        );
    }

    @SuppressWarnings("unchecked")
    private UploadResponse buildResponse(Map<?, ?> result, String folder) {
        return UploadResponse.builder()
                .url((String) result.get("secure_url"))
                .publicId((String) result.get("public_id"))
                .resourceType((String) result.get("resource_type"))
                .format((String) result.get("format"))
                .bytes(result.get("bytes") != null ? Long.parseLong(result.get("bytes").toString()) : null)
                .width(result.get("width") != null ? (Integer) result.get("width") : null)
                .height(result.get("height") != null ? (Integer) result.get("height") : null)
                .folder(folder)
                .build();
    }
}
