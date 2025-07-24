import dataService from './dataService';

class AuthService {
  // Login user
  login(username, password) {
    const normalizedUsername = username.trim().toLowerCase();
    const user = dataService.getUserByUsername(normalizedUsername);
    if (user && user.password === password) {
      dataService.setCurrentUser(user.id);
      return { success: true, user };
    }
    return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng' };
  }

  // Register new user
  register(userData) {
    const normalizedUsername = userData.username.trim().toLowerCase();
    
    // Prevent admin account creation
    if (normalizedUsername === 'admin') {
      return { success: false, message: 'Tên đăng nhập không được phép' };
    }
    
    // Check if username already exists
    if (dataService.getUserByUsername(normalizedUsername)) {
      return { success: false, message: 'Tên đăng nhập đã tồn tại' };
    }

    // Check if email already exists
    if (dataService.getUserByEmail(userData.email)) {
      return { success: false, message: 'Email đã được sử dụng' };
    }

    // Validate password
    if (!this.validatePassword(userData.password)) {
      return { 
        success: false, 
        message: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt' 
      };
    }

    // Create new user
    const newUser = dataService.createUser({
      ...userData,
      username: normalizedUsername
    });
    dataService.setCurrentUser(newUser.id);
    return { success: true, user: newUser };
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

  // Password validation
  validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  // Email validation
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Username validation
  validateUsername(username) {
    // 3-20 characters, alphanumeric and underscore only
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  }
}

export default new AuthService();