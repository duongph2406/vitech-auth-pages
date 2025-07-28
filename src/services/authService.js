import dataService from './dataService';
import { MESSAGES } from '../constants';

class AuthService {
  // Simple validation helpers
  validateUsername(username) {
    if (!username || username.trim().length < 3) {
      return 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }
    if (username.trim().length > 20) {
      return 'Tên đăng nhập không được vượt quá 20 ký tự';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      return 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới';
    }
    const reserved = ['admin', 'administrator', 'root', 'system'];
    if (reserved.includes(username.trim().toLowerCase())) {
      return 'Tên đăng nhập không được phép';
    }
    return null;
  }

  validateEmail(email) {
    if (!email) return 'Email là bắt buộc';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return 'Định dạng email không hợp lệ';
    }
    return null;
  }

  validatePassword(password) {
    if (!password) return 'Mật khẩu là bắt buộc';
    if (password.length < 8) {
      return 'Mật khẩu phải có ít nhất 8 ký tự';
    }
    return null;
  }

  // Login user
  login(username, password) {
    try {
      // Validate inputs
      const usernameError = this.validateUsername(username);
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
      
      return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Đã xảy ra lỗi khi đăng nhập' };
    }
  }

  // Register new user
  register(userData) {
    try {
      // Validate all fields
      const usernameError = this.validateUsername(userData.username);
      if (usernameError) {
        return { success: false, message: usernameError };
      }

      const emailError = this.validateEmail(userData.email);
      if (emailError) {
        return { success: false, message: emailError };
      }

      const passwordError = this.validatePassword(userData.password);
      if (passwordError) {
        return { success: false, message: passwordError };
      }

      const normalizedUsername = userData.username.trim().toLowerCase();
      
      // Check if username already exists
      if (dataService.getUserByUsername(normalizedUsername)) {
        return { success: false, message: 'Tên đăng nhập đã tồn tại' };
      }

      // Check if email already exists
      if (dataService.getUserByEmail(userData.email)) {
        return { success: false, message: 'Email đã được sử dụng' };
      }

      // Create new user
      const newUser = dataService.createUser({
        ...userData,
        username: normalizedUsername
      });
      dataService.setCurrentUser(newUser.id);
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: 'Đã xảy ra lỗi khi đăng ký' };
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

    const passwordError = this.validatePassword(newPassword);
    if (passwordError) {
      return { success: false, message: passwordError };
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
  updateAvatar(avatarDataUrl) {
    try {
      const user = dataService.getCurrentUser();
      if (!user) {
        return { success: false, message: 'Người dùng chưa đăng nhập' };
      }

      const updatedUser = dataService.updateUser(user.id, { avatar: avatarDataUrl });
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Update avatar error:', error);
      return { success: false, message: 'Không thể cập nhật avatar' };
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
      console.error('Remove avatar error:', error);
      return { success: false, message: 'Không thể xóa avatar' };
    }
  }
}

const authService = new AuthService();
export default authService;