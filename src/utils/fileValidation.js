/**
 * File validation utilities for uploads
 */

// File size limits (in bytes)
const FILE_SIZE_LIMITS = {
  AVATAR: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  IMAGE: 5 * 1024 * 1024 // 5MB
};

// Allowed file types
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp'
];

const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

/**
 * Validate image file for avatar upload
 */
export const validateFile = (file, type = 'avatar') => {
  const result = {
    isValid: false,
    error: '',
    warnings: []
  };

  // Check if file exists
  if (!file) {
    result.error = 'Vui lòng chọn file';
    return result;
  }

  // Check file size
  const sizeLimit = FILE_SIZE_LIMITS[type.toUpperCase()] || FILE_SIZE_LIMITS.IMAGE;
  if (file.size > sizeLimit) {
    const sizeMB = Math.round(sizeLimit / (1024 * 1024));
    result.error = `Kích thước file không được vượt quá ${sizeMB}MB`;
    return result;
  }

  // Check file type for images
  if (type === 'avatar' || type === 'image') {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      result.error = 'Chỉ hỗ trợ file ảnh: JPG, PNG, GIF, WebP';
      return result;
    }
  }

  // Check file type for documents
  if (type === 'document') {
    if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
      result.error = 'Chỉ hỗ trợ file: PDF, DOC, DOCX';
      return result;
    }
  }

  // Additional checks for images
  if (type === 'avatar' || type === 'image') {
    // Check if file is too small (might be corrupted)
    if (file.size < 1024) { // Less than 1KB
      result.warnings.push('File có vẻ quá nhỏ, có thể bị lỗi');
    }

    // Check file name
    if (file.name.length > 100) {
      result.warnings.push('Tên file quá dài');
    }
  }

  result.isValid = true;
  return result;
};

/**
 * Get file size in human readable format
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check if file is an image
 */
export const isImageFile = (file) => {
  return ALLOWED_IMAGE_TYPES.includes(file.type);
};

/**
 * Get image dimensions
 */
export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    if (!isImageFile(file)) {
      reject(new Error('File is not an image'));
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: img.naturalWidth / img.naturalHeight
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load image'));
    };

    img.src = url;
  });
};

/**
 * Compress image file
 */
export const compressImage = (file, maxWidth = 800, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    if (!isImageFile(file)) {
      reject(new Error('File is not an image'));
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      // Set canvas size
      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          
          // Create new file object
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          });
          
          resolve(compressedFile);
        },
        file.type,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load image'));
    };

    img.src = url;
  });
};

/**
 * Convert file to base64
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read file'));
    
    reader.readAsDataURL(file);
  });
};