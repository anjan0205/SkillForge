/**
 * uploadService.ts
 * ================
 * Frontend service for uploading files to Cloudinary via the SkillForge backend.
 *
 * IMPORTANT: This service communicates with the backend API using JWT authentication.
 * NO Cloudinary credentials are ever exposed to the frontend.
 * All credentials live in backend environment variables (CLOUDINARY_*).
 *
 * Endpoints:
 *   POST /api/upload/image     — images (JPG, PNG, GIF, WebP, SVG)
 *   POST /api/upload/video     — videos (MP4, MOV, AVI, WebM) — Instructor/Admin only
 *   POST /api/upload/document  — documents (PDF, DOCX, PPTX, XLSX)
 *   DELETE /api/upload/:id     — delete a file by Cloudinary public ID
 */

import api from './api';

// Response shape returned by the backend after a successful upload
export interface UploadResponse {
  url: string;          // Public CDN URL — use this in img/video src
  publicId: string;     // Cloudinary public ID — needed for deletion
  resourceType: string; // "image" | "video" | "raw"
  format: string;       // "jpg" | "mp4" | "pdf" | etc.
  bytes: number;        // File size in bytes
  width?: number;       // Pixels (images/videos only)
  height?: number;      // Pixels (images/videos only)
  folder: string;       // Cloudinary folder path
}

// Upload progress callback type
type ProgressCallback = (percent: number) => void;

// ============================================================================
// UPLOAD FUNCTIONS
// ============================================================================

/**
 * Upload an image file.
 * Accepted: JPG, PNG, GIF, WebP, SVG
 * Available to all authenticated users.
 *
 * @param file      the File object from an <input type="file"> or drag-and-drop
 * @param onProgress  optional callback receiving upload % (0–100)
 */
export async function uploadImage(
  file: File,
  onProgress?: ProgressCallback
): Promise<UploadResponse> {
  return uploadFile(file, 'image', onProgress);
}

/**
 * Upload a video file for a course lesson.
 * Accepted: MP4, MOV, AVI, WebM
 * Restricted to Instructor and Admin roles only.
 *
 * @param file      the File object
 * @param onProgress  optional callback receiving upload % (0–100)
 */
export async function uploadVideo(
  file: File,
  onProgress?: ProgressCallback
): Promise<UploadResponse> {
  return uploadFile(file, 'video', onProgress);
}

/**
 * Upload a course document (PDF, DOCX, PPTX, XLSX).
 * Available to all authenticated users.
 *
 * @param file      the File object
 * @param onProgress  optional callback receiving upload % (0–100)
 */
export async function uploadDocument(
  file: File,
  onProgress?: ProgressCallback
): Promise<UploadResponse> {
  return uploadFile(file, 'document', onProgress);
}

/**
 * Delete a file from Cloudinary by its public ID.
 * The publicId is returned in the UploadResponse when a file is uploaded.
 * Restricted to Instructor and Admin roles only.
 *
 * @param publicId      the Cloudinary public_id (e.g. "skillforge/images/abc123")
 * @param resourceType  "image" | "video" | "raw" (default: "image")
 */
export async function deleteFile(
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<{ message: string; publicId: string }> {
  // Encode slashes in public ID for the URL path
  const encodedId = encodeURIComponent(publicId);
  const { data } = await api.delete(`/upload/${encodedId}`, {
    params: { resourceType },
  });
  return data;
}

// ============================================================================
// INTERNAL HELPERS
// ============================================================================

async function uploadFile(
  file: File,
  type: 'image' | 'video' | 'document',
  onProgress?: ProgressCallback
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post<UploadResponse>(`/upload/${type}`, formData, {
    headers: {
      // Override Content-Type so axios sets multipart/form-data with boundary automatically
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });

  return data;
}

// ============================================================================
// VALIDATION HELPERS (client-side pre-checks before upload)
// ============================================================================

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;     // 10 MB
const MAX_VIDEO_SIZE = 500 * 1024 * 1024;    // 500 MB
const MAX_DOCUMENT_SIZE = 50 * 1024 * 1024;  // 50 MB

export function validateImageFile(file: File): string | null {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  if (!allowed.includes(file.type)) return 'Only JPG, PNG, GIF, WebP, and SVG images are allowed.';
  if (file.size > MAX_IMAGE_SIZE) return 'Image must be under 10 MB.';
  return null;
}

export function validateVideoFile(file: File): string | null {
  const allowed = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
  if (!allowed.includes(file.type)) return 'Only MP4, MOV, AVI, and WebM videos are allowed.';
  if (file.size > MAX_VIDEO_SIZE) return 'Video must be under 500 MB.';
  return null;
}

export function validateDocumentFile(file: File): string | null {
  const allowed = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];
  if (!allowed.includes(file.type)) return 'Only PDF, DOCX, PPTX, and XLSX files are allowed.';
  if (file.size > MAX_DOCUMENT_SIZE) return 'Document must be under 50 MB.';
  return null;
}

/** Format bytes into a human-readable string (e.g. "4.2 MB") */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
