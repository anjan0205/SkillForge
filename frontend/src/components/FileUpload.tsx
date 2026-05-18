import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import {
  uploadImage,
  uploadVideo,
  uploadDocument,
  validateImageFile,
  validateVideoFile,
  validateDocumentFile,
  formatFileSize,
  UploadResponse,
} from '../services/uploadService';

// ============================================================================
// TYPES
// ============================================================================

type UploadType = 'image' | 'video' | 'document';

interface FileUploadProps {
  /** The kind of file to accept */
  type: UploadType;
  /** Called with the UploadResponse when upload succeeds */
  onUploadComplete: (result: UploadResponse) => void;
  /** Optional error handler */
  onError?: (error: string) => void;
  /** Optional label shown above the dropzone */
  label?: string;
  /** Show a preview thumbnail after upload (images only) */
  showPreview?: boolean;
  /** Extra CSS classes on the root div */
  className?: string;
}

// ============================================================================
// CONFIG PER TYPE
// ============================================================================

const typeConfig: Record<UploadType, {
  accept: string;
  hint: string;
  icon: string;
  validate: (f: File) => string | null;
  upload: (f: File, cb: (p: number) => void) => Promise<UploadResponse>;
}> = {
  image: {
    accept: 'image/jpeg,image/png,image/gif,image/webp,image/svg+xml',
    hint: 'JPG, PNG, GIF, WebP, SVG — max 10 MB',
    icon: 'image',
    validate: validateImageFile,
    upload: (f, cb) => uploadImage(f, cb),
  },
  video: {
    accept: 'video/mp4,video/quicktime,video/x-msvideo,video/webm',
    hint: 'MP4, MOV, AVI, WebM — max 500 MB',
    icon: 'play_circle',
    validate: validateVideoFile,
    upload: (f, cb) => uploadVideo(f, cb),
  },
  document: {
    accept: 'application/pdf,application/msword,.docx,.pptx,.xlsx',
    hint: 'PDF, DOCX, PPTX, XLSX — max 50 MB',
    icon: 'description',
    validate: validateDocumentFile,
    upload: (f, cb) => uploadDocument(f, cb),
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * FileUpload — Drag-and-drop file upload component.
 *
 * Usage:
 *   <FileUpload
 *     type="image"
 *     label="Course Thumbnail"
 *     showPreview
 *     onUploadComplete={(result) => setCourseImage(result.url)}
 *   />
 *
 * Prerequisites (backend):
 *   Set CLOUDINARY_ENABLED=true and provide Cloudinary credentials.
 *   See application.properties for setup instructions.
 */
export default function FileUpload({
  type,
  onUploadComplete,
  onError,
  label,
  showPreview = false,
  className = '',
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState<UploadResponse | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const config = typeConfig[type];

  // --------------------------------------------------------------------------
  // EVENT HANDLERS
  // --------------------------------------------------------------------------

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = async (file: File) => {
    // Client-side validation
    const validationError = config.validate(file);
    if (validationError) {
      setError(validationError);
      onError?.(validationError);
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      const result = await config.upload(file, setProgress);
      setUploaded(result);
      onUploadComplete(result);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string; hint?: string } } })
          ?.response?.data?.message ||
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Upload failed. Please try again.';

      // Check specifically for "not configured" error
      const hint =
        (err as { response?: { data?: { hint?: string } } })?.response?.data?.hint;
      const fullMessage = hint ? `${message} — ${hint}` : message;

      setError(fullMessage);
      onError?.(fullMessage);
    } finally {
      setUploading(false);
    }
  };

  // --------------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------------

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Label */}
      {label && (
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* Dropzone */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 p-6
          flex flex-col items-center justify-center gap-3 min-h-[140px]
          ${isDragging
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-outline/30 bg-surface-container-low hover:border-primary/50 hover:bg-primary/3'
          }
          ${uploading ? 'pointer-events-none opacity-70' : ''}
        `}
      >
        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept={config.accept}
          className="hidden"
          onChange={handleInputChange}
          disabled={uploading}
        />

        {uploading ? (
          /* Upload progress */
          <div className="flex flex-col items-center gap-3 w-full max-w-xs">
            <div className="relative w-14 h-14">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor"
                  className="text-outline/20" strokeWidth="4" />
                <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor"
                  className="text-primary transition-all duration-300"
                  strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 24}`}
                  strokeDashoffset={`${2 * Math.PI * 24 * (1 - progress / 100)}`}
                  strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-label-sm text-label-sm text-primary">
                {progress}%
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Uploading…</p>
          </div>
        ) : uploaded ? (
          /* Success state */
          <div className="flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[40px] text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>
              check_circle
            </span>
            <p className="font-label-md text-label-md text-on-surface">Upload complete!</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {formatFileSize(uploaded.bytes)}
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); setUploaded(null); }}
              className="text-primary font-label-sm text-label-sm hover:underline"
            >
              Replace file
            </button>
          </div>
        ) : (
          /* Default idle state */
          <>
            <span className="material-symbols-outlined text-[40px] text-on-surface-variant/50">
              {config.icon}
            </span>
            <div className="text-center">
              <p className="font-body-md text-body-md text-on-surface">
                <span className="text-primary font-semibold">Click to upload</span>{' '}
                or drag &amp; drop
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                {config.hint}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-error/10 border border-error/30">
          <span className="material-symbols-outlined text-[16px] text-error mt-0.5 flex-shrink-0">error</span>
          <p className="font-body-sm text-body-sm text-error">{error}</p>
        </div>
      )}

      {/* Image preview (optional) */}
      {showPreview && uploaded && type === 'image' && (
        <div className="mt-2 rounded-2xl overflow-hidden border border-outline/20 aspect-video bg-surface-container">
          <img
            src={uploaded.url}
            alt="Upload preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
