/**
 * Avatar Upload Component with preview and crop functionality
 */

import { useState, useRef } from 'react';
import './AvatarUpload.css';

const AvatarUpload = ({ currentAvatar, onAvatarChange, disabled = false, userInfo = {} }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Generate initials from user name
  const getInitials = () => {
    if (userInfo.firstName && userInfo.lastName) {
      return (userInfo.firstName[0] + userInfo.lastName[0]).toUpperCase();
    } else if (userInfo.firstName) {
      return userInfo.firstName[0].toUpperCase();
    } else if (userInfo.lastName) {
      return userInfo.lastName[0].toUpperCase();
    }
    return 'U'; // Default fallback
  };

  // Handle file selection
  const handleFileSelect = (file) => {
    if (!file) return;

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

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const avatarInfo = {
        file: file,
        preview: e.target.result,
        name: file.name,
        size: file.size,
        type: file.type
      };
      onAvatarChange(avatarInfo);
    };
    reader.readAsDataURL(file);
  };

  // Handle file input change
  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;

    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  // Handle click to open file dialog
  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="avatar-upload-container">
      <div 
        className={`avatar-upload ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {currentAvatar ? (
          <div className="avatar-preview">
            <img src={currentAvatar} alt="Avatar preview" />
            {!disabled && (
              <div className="avatar-overlay">
                <div className="avatar-overlay-content">
                  <span className="camera-icon">📷</span>
                  <span className="upload-text">Thay đổi ảnh</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="avatar-placeholder">
            <div className="avatar-initials-circle">
              <span className="avatar-initials">{getInitials()}</span>
            </div>
            {!disabled && (
              <div className="avatar-placeholder-content">
                <span className="camera-icon">📷</span>
                <span className="upload-text">Tải lên ảnh đại diện</span>
                <span className="upload-hint">Kéo thả hoặc click để chọn</span>
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
          disabled={disabled}
        />
      </div>

      <div className="avatar-info">
        <p className="avatar-requirements">
          • Định dạng: JPG, PNG, GIF<br/>
          • Kích thước tối đa: 5MB<br/>
          • Khuyến nghị: 400x400px
        </p>
      </div>
    </div>
  );
};

export default AvatarUpload;