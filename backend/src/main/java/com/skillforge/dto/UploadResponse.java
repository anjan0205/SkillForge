package com.skillforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO returned after a successful file upload to Cloudinary.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UploadResponse {
    /** Public CDN URL of the uploaded file (use this in the frontend). */
    private String url;

    /** Cloudinary public ID — used for deletion and transformations. */
    private String publicId;

    /** Resource type: "image", "video", or "raw" (documents). */
    private String resourceType;

    /** File format: "jpg", "png", "mp4", "pdf", etc. */
    private String format;

    /** File size in bytes. */
    private Long bytes;

    /** Display width in pixels (images/videos only). */
    private Integer width;

    /** Display height in pixels (images/videos only). */
    private Integer height;

    /** Cloudinary folder where the file was stored. */
    private String folder;
}
