/**
 * Modern AvatarUpload component for profile management
 */

import React, { memo, useState, useCallback, useRef } from 'react';
import { Button } from '../../shared/components/Button';
import { LoadingSpinner } from '../../shared/components/LoadingSpinner';
import './AvatarUpload.css';

const AvatarUpload = memo(({
  currentAvatar,
  onAvatarUpdate,
  disabled = false,
  userInfo = {}
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const getInitials = useCallback(() => {
    if (userInfo.firstName && userInfo.lastName) {
      return (userInfo.firstName[0] + userInfo.lastName[0]).toUpperCase();
    } else if (userInfo.firstName) {
      return userInfo.firstName[0].toUpperCase();
    } else if (userInfo.lastName) {
      return userInfo.lastName[0].toUpperCase();
    }
    return 'U';
  }, [userInfo]);

  const handleFileSelect = useCallback(async (file) => {
    if (!file || disabled) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh hợp lệ');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước file không được vượt quá 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Create preview URL
      const reader = new FileReader();
      reader.onload = async (e) => {
        const avatarData = e.target.result;
        await onAvatarUpdate(avatarData);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Avatar upload error:', error);
      setIsUploading(false);
    }
  }, [disabled, onAvatarUpdate]);

  const handleInputChange = useCallback((e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;

    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  }, [disabled, handleFileSelect]);

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  const handleRemove = useCallback(async () => {
    if (disabled) return;
    
    setIsUploading(true);
    try {
      await onAvatarUpdate(null);
    } catch (error) {
      console.error('Avatar remove error:', error);
    } finally {
      setIsUploading(false);
    }
  }, [disabled, onAvatarUpdate]);

  return (
    <div className="avatar-upload">
      <div 
        className={`avatar-upload__container ${isDragging ? 'avatar-upload__container--dragging' : ''} ${disabled ? 'avatar-upload__container--disabled' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {isUploading ? (
          <div className="avatar-upload__loading">
            <LoadingSpinner size="large" />
          </div>
        ) : currentAvatar ? (
          <div className="avatar-upload__preview">
            <img 
              src={currentAvatar} 
              alt="Avatar preview" 
              className="avatar-upload__image"
            />
            {!disabled && (
              <div className="avatar-upload__overlay">
                <div className="avatar-upload__overlay-content">
                  <span className="avatar-upload__icon">📷</span>
                  <span className="avatar-upload__text">Thay đổi ảnh</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="avatar-upload__placeholder">
            <div className="avatar-upload__initials">
              {getInitials()}
            </div>
            {!disabled && (
              <div className="avatar-upload__placeholder-content">
                <span className="avatar-upload__icon">📷</span>
                <span className="avatar-upload__text">Tải lên ảnh</span>
                <span className="avatar-upload__hint">Kéo thả hoặc click</span>
              </div>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          style={{ display: 'none' }}
          disabled={disabled || isUploading}
        />
      </div>

      {currentAvatar && !disabled && !isUploading && (
        <div className="avatar-upload__actions">
          <Button
            variant="danger"
            size="small"
            onClick={handleRemove}
          >
            Xóa ảnh
          </Button>
        </div>
      )}
    </div>
  );
});

AvatarUpload.displayName = 'AvatarUpload';

export { AvatarUpload };