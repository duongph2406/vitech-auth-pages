import dataService from './dataService';
import { validateEmail, validatePassword, validateUsername } from '../lib/validation';
import errorHandler from '../lib/errorHandler';
import { MESSAGES } from '../lib/constants';

class AuthService {
  // Login user
  login(username, password) {
    try {
      // Validate inputs
      const usernameError = validateUsername(username);
      if (usernameError) {
        return { success: false, message: usernameError };
      }

      if (!password) {
        return { success: false, message: 'Mật khẩu là bắt buộc' };
      }

      const normalizedUsername = username.trim().toLowerCase();
      const user = dataService.getUserByUsername(normalizedUsername);
      
      if (user && user.password === password) {
        dataService.setCurrentUser(user.id);
        return { success: true, user };
      }
      
      return { success: false, message: MESSAGES.LOGIN_ERROR };
    } catch (error) {
      const handledError = errorHandler.handleError(error);
      return { success: false, message: handledError.message };
    }
  }

  // Register new user
  register(userData) {
    try {
      // Validate all fields
      const usernameError = validateUsername(userData.username);
      if (usernameError) {
        return { success: false, message: usernameError };
      }

      const emailError = validateEmail(userData.email);
      if (emailError) {
        return { success: false, message: emailError };
      }

      const passwordError = validatePassword(userData.password);
      if (passwordError) {
        return { success: false, message: passwordError };
      }

      const normalizedUsername = userData.username.trim().toLowerCase();
      
      // Check if username already exists
      if (dataService.getUserByUsername(normalizedUsername)) {
        return { success: false, message: MESSAGES.USERNAME_EXISTS };
      }

      // Check if email already exists
      if (dataService.getUserByEmail(userData.email)) {
        return { success: false, message: MESSAGES.EMAIL_EXISTS };
      }

      // Create new user
      const newUser = dataService.createUser({
        ...userData,
        username: normalizedUsername
      });
      dataService.setCurrentUser(newUser.id);
      return { success: true, user: newUser };
    } catch (error) {
      const handledError = errorHandler.handleError(error);
      return { success: false, message: handledError.message };
    }
  }

  // Logout user
  logout() {
    dataService.clearCurrentUser();
    return { success: true };
  }

  // Get current logged in user
  getCurrentUser() {
    return dataService.getCurrentUser();
  }

  // Check if user is logged in
  isLoggedIn() {
    return dataService.getCurrentUser() !== null;
  }

  // Change password
  changePassword(currentPassword, newPassword) {
    const user = dataService.getCurrentUser();
    if (!user) {
      return { success: false, message: 'Người dùng chưa đăng nhập' };
    }

    if (user.password !== currentPassword) {
      return { success: false, message: 'Mật khẩu hiện tại không đúng' };
    }

    if (!this.validatePassword(newPassword)) {
      return { 
        success: false, 
        message: 'Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt' 
      };
    }

    const updatedUser = dataService.updateUser(user.id, { password: newPassword });
    return { success: true, user: updatedUser };
  }

  // Update user profile
  updateProfile(profileData) {
    const user = dataService.getCurrentUser();
    if (!user) {
      return { success: false, message: 'Người dùng chưa đăng nhập' };
    }

    // Check if new username is taken by another user
    if (profileData.username && profileData.username !== user.username) {
      const existingUser = dataService.getUserByUsername(profileData.username);
      if (existingUser && existingUser.id !== user.id) {
        return { success: false, message: 'Tên đăng nhập đã tồn tại' };
      }
    }

    // Check if new email is taken by another user
    if (profileData.email && profileData.email !== user.email) {
      const existingUser = dataService.getUserByEmail(profileData.email);
      if (existingUser && existingUser.id !== user.id) {
        return { success: false, message: 'Email đã được sử dụng' };
      }
    }

    const updatedUser = dataService.updateUser(user.id, profileData);
    return { success: true, user: updatedUser };
  }

  // Avatar management
  updateAvatar(avatarData) {
    try {
      const user = dataService.getCurrentUser();
      if (!user) {
        return { success: false, message: 'Người dùng chưa đăng nhập' };
      }

      const updatedUser = dataService.updateUserAvatar(user.id, avatarData);
      if (updatedUser) {
        return { success: true, user: updatedUser };
      } else {
        return { success: false, message: 'Không thể cập nhật avatar' };
      }
    } catch (error) {
      const handledError = errorHandler.handleError(error);
      return { success: false, message: handledError.message };
    }
  }

  removeAvatar() {
    try {
      const user = dataService.getCurrentUser();
      if (!user) {
        return { success: false, message: 'Người dùng chưa đăng nhập' };
      }

      const updatedUser = dataService.removeUserAvatar(user.id);
      if (updatedUser) {
        return { success: true, user: updatedUser };
      } else {
        return { success: false, message: 'Không thể xóa avatar' };
      }
    } catch (error) {
      const handledError = errorHandler.handleError(error);
      return { success: false, message: handledError.message };
    }
  }

  // Avatar management
  updateAvatar(avatarDataUrl) {
    try {
      const user = dataService.getCurrentUser();
      if (!user) {
        return { success: false, message: 'Người dùng chưa đăng nhập' };
      }

      const updatedUser = dataService.updateUser(user.id, { avatar: avatarDataUrl });
      return { success: true, user: updatedUser };
    } catch (error) {
      const handledError = errorHandler.handleError(error);
      return { success: false, message: handledError.message };
    }
  }

  removeAvatar() {
    try {
      const user = dataService.getCurrentUser();
      if (!user) {
        return { success: false, message: 'Người dùng chưa đăng nhập' };
      }

      const updatedUser = dataService.updateUser(user.id, { avatar: null });
      return { success: true, user: updatedUser };
    } catch (error) {
      const handledError = errorHandler.handleError(error);
      return { success: false, message: handledError.message };
    }
  }

  // Validation methods (delegated to validation utils)
  validatePassword(password) {
    return !validatePassword(password);
  }

  validateEmail(email) {
    return !validateEmail(email);
  }

  validateUsername(username) {
    return !validateUsername(username);
  }
}

const authService = new AuthService();
export default authService;