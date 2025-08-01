import { useState, useEffect } from 'react';
import './AccountProfile.css';
import { Modal } from '../Modal';
import { AvatarUpload } from '../Avatar';
import authService from '../../services/authService';
import dataService from '../../services/dataService';
import { usePageTitle, PAGE_TITLES } from '../../hooks/usePageTitle';
import { formatPhoneNumber, cleanPhoneNumber } from '../../utils/formatters';
import { validatePhone } from '../../utils/validation';
import { compressImage, resizeToSquare, validateImageFile } from '../../utils/imageUtils';

function AccountProfile({ onLogout }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Thiết lập tiêu đề trang động
  usePageTitle(PAGE_TITLES.PROFILE);

  const [phoneError, setPhoneError] = useState('');
  const [avatarData, setAvatarData] = useState(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Helper function to generate initials
  const getInitials = (firstName = '', lastName = '') => {
    if (firstName && lastName) {
      return (firstName[0] + lastName[0]).toUpperCase();
    } else if (firstName) {
      return firstName[0].toUpperCase();
    } else if (lastName) {
      return lastName[0].toUpperCase();
    }
    return 'U'; // Default fallback
  };

  // User data from localStorage
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    phone: '',
    avatar: null
  });

  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [editAddress, setEditAddress] = useState(null); // địa chỉ đang sửa
  const [showEditAddressForm, setShowEditAddressForm] = useState(false);
  const [editPayment, setEditPayment] = useState(null); // payment đang sửa
  const [showEditPaymentForm, setShowEditPaymentForm] = useState(false);

  // Load user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUserInfo({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        username: currentUser.username,
        phone: currentUser.phone ? formatPhoneNumber(currentUser.phone) : '',
        avatar: currentUser.avatar
      });
      setAddresses(currentUser.addresses || []);
      setPaymentMethods(currentUser.paymentMethods || []);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // Avatar handlers
  const handleAvatarChange = async (avatarInfo) => {
    if (!avatarInfo) {
      setAvatarData(null);
      return;
    }

    setIsUploadingAvatar(true);
    try {
      // Validate image file
      const validation = validateImageFile(avatarInfo.file);
      if (!validation.isValid) {
        showMessage('error', validation.errors.join(', '));
        setIsUploadingAvatar(false);
        return;
      }

      // Process image: resize to square and compress
      let processedFile = avatarInfo.file;

      // First resize to square for avatar
      processedFile = await resizeToSquare(processedFile, 400);

      // Then compress if still too large
      if (processedFile.size > 500 * 1024) { // If larger than 500KB
        processedFile = await compressImage(processedFile, 400, 0.8);
      }

      setAvatarData({
        file: processedFile,
        preview: avatarInfo.preview,
        name: avatarInfo.name,
        size: processedFile.size,
        originalSize: avatarInfo.file.size
      });
    } catch (error) {
      console.error('Avatar processing error:', error);
      showMessage('error', 'Không thể xử lý ảnh. Vui lòng thử lại.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveAvatar = async () => {
    if (!avatarData) return;

    setIsUploadingAvatar(true);
    try {
      const result = authService.updateAvatar(avatarData.preview);
      if (result.success) {
        showMessage('success', 'Cập nhật ảnh đại diện thành công!');
        loadUserData();
        setAvatarData(null);
      } else {
        showMessage('error', result.message);
      }
    } catch (error) {
      showMessage('error', 'Có lỗi xảy ra khi lưu ảnh đại diện');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setIsUploadingAvatar(true);
    try {
      const result = authService.removeAvatar();
      if (result.success) {
        showMessage('success', 'Xóa ảnh đại diện thành công!');
        loadUserData();
        setAvatarData(null);
      } else {
        showMessage('error', result.message);
      }
    } catch (error) {
      showMessage('error', 'Có lỗi xảy ra khi xóa ảnh đại diện');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();

    // Validate phone number if provided
    if (userInfo.phone) {
      const cleanPhone = cleanPhoneNumber(userInfo.phone);
      const phoneValidationError = validatePhone(cleanPhone);
      if (phoneValidationError) {
        setPhoneError(phoneValidationError);
        showMessage('error', phoneValidationError);
        return;
      }
    }

    // Clean phone number before saving
    const profileData = {
      ...userInfo,
      phone: userInfo.phone ? cleanPhoneNumber(userInfo.phone) : ''
    };

    const result = authService.updateProfile(profileData);
    if (result.success) {
      setIsEditing(false);
      setPhoneError('');
      showMessage('success', 'Cập nhật thông tin thành công!');
      loadUserData(); // Reload data
    } else {
      showMessage('error', result.message);
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    if (newPassword !== confirmPassword) {
      showMessage('error', 'Mật khẩu mới không khớp');
      return;
    }

    const result = authService.changePassword(currentPassword, newPassword);
    if (result.success) {
      setShowPasswordForm(false);
      showMessage('success', 'Đổi mật khẩu thành công!');
      e.target.reset();
    } else {
      showMessage('error', result.message);
    }
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const addressData = {
      type: formData.get('type'),
      address: formData.get('address'),
      city: formData.get('city'),
      country: formData.get('country')
    };

    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      showMessage('error', 'Bạn cần đăng nhập lại để thực hiện thao tác này!');
      return;
    }
    const newAddress = dataService.addAddress(currentUser.id, addressData);
    if (newAddress) {
      setShowAddressForm(false);
      showMessage('success', 'Thêm địa chỉ thành công!');
      loadUserData();
    } else {
      showMessage('error', 'Có lỗi xảy ra khi thêm địa chỉ');
    }
  };

  const handleDeleteAddress = (addressId) => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      showMessage('error', 'Bạn cần đăng nhập lại để thực hiện thao tác này!');
      return;
    }
    const success = dataService.deleteAddress(currentUser.id, addressId);
    if (success) {
      showMessage('success', 'Xóa địa chỉ thành công!');
      loadUserData();
    } else {
      showMessage('error', 'Có lỗi xảy ra khi xóa địa chỉ');
    }
  };

  const handleAddPayment = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const paymentData = {
      type: formData.get('cardType'),
      last4: formData.get('cardNumber').slice(-4),
      expiry: formData.get('expiry'),
      cardName: formData.get('cardName')
    };

    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      showMessage('error', 'Bạn cần đăng nhập lại để thực hiện thao tác này!');
      return;
    }
    const newPayment = dataService.addPaymentMethod(currentUser.id, paymentData);
    if (newPayment) {
      setShowPaymentForm(false);
      showMessage('success', 'Thêm thẻ thanh toán thành công!');
      loadUserData();
    } else {
      showMessage('error', 'Có lỗi xảy ra khi thêm thẻ');
    }
  };

  const handleDeletePayment = (paymentId) => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      showMessage('error', 'Bạn cần đăng nhập lại để thực hiện thao tác này!');
      return;
    }
    const success = dataService.deletePaymentMethod(currentUser.id, paymentId);
    if (success) {
      showMessage('success', 'Xóa thẻ thanh toán thành công!');
      loadUserData();
    } else {
      showMessage('error', 'Có lỗi xảy ra khi xóa thẻ');
    }
  };

  // Sửa địa chỉ
  const handleEditAddress = (address) => {
    setEditAddress(address);
    setShowEditAddressForm(true);
  };
  const handleUpdateAddress = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const addressData = {
      type: formData.get('type'),
      address: formData.get('address'),
      city: formData.get('city'),
      country: formData.get('country')
    };
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      showMessage('error', 'Bạn cần đăng nhập lại để thực hiện thao tác này!');
      return;
    }
    const updated = dataService.updateAddress(currentUser.id, editAddress.id, addressData);
    if (updated) {
      setShowEditAddressForm(false);
      setEditAddress(null);
      showMessage('success', 'Cập nhật địa chỉ thành công!');
      loadUserData();
    } else {
      showMessage('error', 'Có lỗi xảy ra khi cập nhật địa chỉ');
    }
  };
  // Sửa payment
  const handleEditPayment = (payment) => {
    setEditPayment(payment);
    setShowEditPaymentForm(true);
  };
  const handleUpdatePayment = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const paymentData = {
      type: formData.get('cardType'),
      last4: formData.get('cardNumber').slice(-4),
      expiry: formData.get('expiry'),
      cardName: formData.get('cardName')
    };
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      showMessage('error', 'Bạn cần đăng nhập lại để thực hiện thao tác này!');
      return;
    }
    const updated = dataService.updatePaymentMethod(currentUser.id, editPayment.id, paymentData);
    if (updated) {
      setShowEditPaymentForm(false);
      setEditPayment(null);
      showMessage('success', 'Cập nhật thẻ thành công!');
      loadUserData();
    } else {
      showMessage('error', 'Có lỗi xảy ra khi cập nhật thẻ');
    }
  };

  return (
    <div className="account-container">
      {/* Header */}
      <div className="account-header">
        <div className="header-content">
          <div className="logo-section">
            <img
              src="https://vitechgroup.vn/wp-content/uploads/2022/11/logo.png"
              alt="ViTech Logo"
              className="logo"
            />
          </div>
          <div className="user-menu">
            <div className="user-avatar">
              {userInfo.avatar ? (
                <img src={userInfo.avatar} alt="User" />
              ) : (
                <div className="avatar-placeholder">
                  {getInitials(userInfo.firstName, userInfo.lastName)}
                </div>
              )}
            </div>
            <span className="user-name">{userInfo.firstName} {userInfo.lastName}</span>
            <button onClick={onLogout} className="logout-btn">Đăng xuất</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="account-main">
        {/* Message Display */}
        {message.text && (
          <div
            className="modal-overlay"
            style={{ zIndex: 2000 }}
            onClick={() => setMessage({ type: '', text: '' })}
          >
            <div
              className={`modal message-modal ${message.type === 'error' ? 'error-message' : 'success-message'}`}
              style={{ textAlign: 'center' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                {message.type === 'success' && (
                  <span style={{ fontSize: 18, display: 'flex', alignItems: 'center' }}>
                    {/* Tick icon SVG */}
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="#fff" /><path d="M6 10.5L9 13.5L14 8.5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                )}
                {message.type === 'error' && (
                  <span style={{ fontSize: 18, display: 'flex', alignItems: 'center' }}>
                    {/* X icon SVG */}
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="#fff" /><path d="M7 7L13 13M13 7L7 13" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" /></svg>
                  </span>
                )}
                <span>{message.text}</span>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar */}
        <div className="account-sidebar">
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span className="nav-icon">👤</span>
              Thông tin cá nhân
            </button>
            <button
              className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <span className="nav-icon">🔒</span>
              Bảo mật
            </button>
            <button
              className={`nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
              onClick={() => setActiveTab('addresses')}
            >
              <span className="nav-icon">📍</span>
              Địa chỉ
            </button>
            <button
              className={`nav-item ${activeTab === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveTab('payments')}
            >
              <span className="nav-icon">💳</span>
              Thanh toán
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="account-content">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Thông tin cá nhân</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="edit-btn"
                >
                  {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="profile-form">
                <div className="avatar-section">
                  <AvatarUpload
                    currentAvatar={avatarData?.preview || userInfo.avatar}
                    onAvatarChange={handleAvatarChange}
                    disabled={!isEditing || isUploadingAvatar}
                    userInfo={userInfo}
                  />

                  {isEditing && avatarData && (
                    <>
                      <div className="avatar-size-info">
                        <span>Kích thước: {(avatarData.size / 1024).toFixed(1)}KB</span>
                        {avatarData.originalSize && avatarData.originalSize > avatarData.size && (
                          <span className="size-reduction">
                            {' '}(giảm {Math.round((1 - avatarData.size / avatarData.originalSize) * 100)}%)
                          </span>
                        )}
                      </div>
                      <div className="avatar-actions">
                        <button
                          type="button"
                          className="save-avatar-btn"
                          onClick={handleSaveAvatar}
                          disabled={isUploadingAvatar}
                        >
                          {isUploadingAvatar ? 'Đang lưu...' : 'Lưu ảnh'}
                        </button>
                        <button
                          type="button"
                          className="cancel-avatar-btn"
                          onClick={() => setAvatarData(null)}
                          disabled={isUploadingAvatar}
                        >
                          Hủy
                        </button>
                      </div>
                    </>
                  )}

                  {isEditing && userInfo.avatar && !avatarData && (
                    <button
                      type="button"
                      className="remove-avatar-btn-text"
                      onClick={handleRemoveAvatar}
                      disabled={isUploadingAvatar}
                    >
                      {isUploadingAvatar ? 'Đang xóa...' : 'Xóa ảnh đại diện'}
                    </button>
                  )}
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Họ</label>
                    <input
                      type="text"
                      value={userInfo.firstName}
                      onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
                      disabled={!isEditing}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Tên</label>
                    <input
                      type="text"
                      value={userInfo.lastName}
                      onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
                      disabled={!isEditing}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                      disabled={!isEditing}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Tên đăng nhập</label>
                    <input
                      type="text"
                      value={userInfo.username}
                      onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
                      disabled={!isEditing}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Số điện thoại</label>
                    <input
                      type="tel"
                      value={userInfo.phone}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Only allow digits and limit to 10 characters
                        const cleanValue = value.replace(/\D/g, '').slice(0, 10);
                        const formattedValue = formatPhoneNumber(cleanValue);

                        setUserInfo({ ...userInfo, phone: formattedValue });

                        // Validate phone number
                        if (cleanValue) {
                          const error = validatePhone(cleanValue);
                          setPhoneError(error);
                        } else {
                          setPhoneError('');
                        }
                      }}
                      disabled={!isEditing}
                      className={`form-input ${phoneError ? 'error' : ''}`}
                      placeholder="0123 456 789"
                      maxLength="12" // XXX XXX XXXX format
                    />
                    {phoneError && (
                      <span className="error-text" style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                        {phoneError}
                      </span>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="form-actions">
                    <button type="submit" className="save-btn">
                      Lưu thay đổi
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Bảo mật tài khoản</h2>
              </div>

              <div className="security-options">
                <div className="security-item">
                  <div className="security-info">
                    <h3>Mật khẩu</h3>
                    <p>Thay đổi mật khẩu để bảo vệ tài khoản của bạn</p>
                  </div>
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="action-btn"
                  >
                    Thay đổi
                  </button>
                </div>
              </div>

              {/* Password Change Modal */}
              <Modal
                isOpen={showPasswordForm}
                onClose={() => setShowPasswordForm(false)}
                title="Thay đổi mật khẩu"
                size="small"
              >
                <form onSubmit={handlePasswordChange}>
                  <div className="form-group">
                    <label>Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      name="currentPassword"
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Mật khẩu mới</label>
                    <input
                      type="password"
                      name="newPassword"
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="modal-actions">
                    <button type="button" onClick={() => setShowPasswordForm(false)} className="cancel-btn">
                      Hủy
                    </button>
                    <button type="submit" className="save-btn">
                      Cập nhật
                    </button>
                  </div>
                </form>
              </Modal>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Địa chỉ của tôi</h2>
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="add-btn"
                >
                  Thêm địa chỉ
                </button>
              </div>

              <div className="addresses-list">
                {addresses.map(address => (
                  <div key={address.id} className="address-card">
                    <div className="address-info">
                      <div className="address-header">
                        <span className="address-type">{address.type}</span>
                        {address.isDefault && <span className="default-badge">Mặc định</span>}
                      </div>
                      <p className="address-text">
                        {address.address}<br />
                        {address.city}, {address.country}
                      </p>
                    </div>
                    <div className="address-actions">
                      <button className="edit-btn small" onClick={() => handleEditAddress(address)}>Sửa</button>
                      <button
                        className="delete-btn small"
                        onClick={() => handleDeleteAddress(address.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Address Modal */}
              {showAddressForm && (
                <div className="modal-overlay">
                  <div className="modal">
                    <div className="modal-header">
                      <h3>Thêm địa chỉ mới</h3>
                      <button
                        onClick={() => setShowAddressForm(false)}
                        className="close-btn"
                      >
                        ×
                      </button>
                    </div>
                    <form onSubmit={handleAddAddress}>
                      <div className="form-group">
                        <label>Loại địa chỉ</label>
                        <select name="type" required className="form-input">
                          <option value="Home">Nhà riêng</option>
                          <option value="Office">Văn phòng</option>
                          <option value="Other">Khác</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Địa chỉ</label>
                        <input
                          type="text"
                          name="address"
                          required
                          className="form-input"
                          placeholder="Số nhà, tên đường"
                        />
                      </div>
                      <div className="form-group">
                        <label>Thành phố</label>
                        <input
                          type="text"
                          name="city"
                          required
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>Quốc gia</label>
                        <input
                          type="text"
                          name="country"
                          required
                          className="form-input"
                          defaultValue="Vietnam"
                        />
                      </div>
                      <div className="modal-actions">
                        <button type="button" onClick={() => setShowAddressForm(false)} className="cancel-btn">
                          Hủy
                        </button>
                        <button type="submit" className="save-btn">
                          Thêm địa chỉ
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Phương thức thanh toán</h2>
                <button
                  onClick={() => setShowPaymentForm(true)}
                  className="add-btn"
                >
                  Thêm thẻ
                </button>
              </div>

              <div className="payments-list">
                {paymentMethods.map(payment => (
                  <div key={payment.id} className="payment-card">
                    <div className="payment-info">
                      <div className="payment-header">
                        <span className="card-type">{payment.type}</span>
                        {payment.isDefault && <span className="default-badge">Mặc định</span>}
                      </div>
                      <p className="card-number">**** **** **** {payment.last4}</p>
                      <p className="card-expiry">Hết hạn: {payment.expiry}</p>
                    </div>
                    <div className="payment-actions">
                      <button className="edit-btn small" onClick={() => handleEditPayment(payment)}>Sửa</button>
                      <button
                        className="delete-btn small"
                        onClick={() => handleDeletePayment(payment.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Payment Modal */}
              {showPaymentForm && (
                <div className="modal-overlay">
                  <div className="modal">
                    <div className="modal-header">
                      <h3>Thêm thẻ thanh toán</h3>
                      <button
                        onClick={() => setShowPaymentForm(false)}
                        className="close-btn"
                      >
                        ×
                      </button>
                    </div>
                    <form onSubmit={handleAddPayment}>
                      <div className="form-group">
                        <label>Loại thẻ</label>
                        <select name="cardType" required className="form-input">
                          <option value="Visa">Visa</option>
                          <option value="Mastercard">Mastercard</option>
                          <option value="JCB">JCB</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Số thẻ</label>
                        <input
                          type="text"
                          name="cardNumber"
                          required
                          className="form-input"
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Ngày hết hạn</label>
                          <input
                            type="text"
                            name="expiry"
                            required
                            className="form-input"
                            placeholder="MM/YY"
                            maxLength="5"
                          />
                        </div>
                        <div className="form-group">
                          <label>CVV</label>
                          <input
                            type="text"
                            name="cvv"
                            required
                            className="form-input"
                            placeholder="123"
                            maxLength="4"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Tên trên thẻ</label>
                        <input
                          type="text"
                          name="cardName"
                          required
                          className="form-input"
                          placeholder="Nguyen Van A"
                        />
                      </div>
                      <div className="modal-actions">
                        <button type="button" onClick={() => setShowPaymentForm(false)} className="cancel-btn">
                          Hủy
                        </button>
                        <button type="submit" className="save-btn">
                          Thêm thẻ
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal sửa địa chỉ */}
      {showEditAddressForm && editAddress && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Sửa địa chỉ</h3>
              <button onClick={() => { setShowEditAddressForm(false); setEditAddress(null); }} className="close-btn">×</button>
            </div>
            <form onSubmit={handleUpdateAddress}>
              <div className="form-group">
                <label>Loại địa chỉ</label>
                <select name="type" required className="form-input" defaultValue={editAddress.type}>
                  <option value="Home">Nhà riêng</option>
                  <option value="Office">Văn phòng</option>
                  <option value="Other">Khác</option>
                </select>
              </div>
              <div className="form-group">
                <label>Địa chỉ</label>
                <input type="text" name="address" required className="form-input" defaultValue={editAddress.address} />
              </div>
              <div className="form-group">
                <label>Thành phố</label>
                <input type="text" name="city" required className="form-input" defaultValue={editAddress.city} />
              </div>
              <div className="form-group">
                <label>Quốc gia</label>
                <input type="text" name="country" required className="form-input" defaultValue={editAddress.country} />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => { setShowEditAddressForm(false); setEditAddress(null); }} className="cancel-btn">Hủy</button>
                <button type="submit" className="save-btn">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal sửa payment */}
      {showEditPaymentForm && editPayment && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Sửa thẻ thanh toán</h3>
              <button onClick={() => { setShowEditPaymentForm(false); setEditPayment(null); }} className="close-btn">×</button>
            </div>
            <form onSubmit={handleUpdatePayment}>
              <div className="form-group">
                <label>Loại thẻ</label>
                <select name="cardType" required className="form-input" defaultValue={editPayment.type}>
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="JCB">JCB</option>
                </select>
              </div>
              <div className="form-group">
                <label>Số thẻ</label>
                <input type="text" name="cardNumber" required className="form-input" maxLength="19" defaultValue={editPayment.last4 ? '**** **** **** ' + editPayment.last4 : ''} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Ngày hết hạn</label>
                  <input type="text" name="expiry" required className="form-input" maxLength="5" defaultValue={editPayment.expiry} />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input type="text" name="cvv" required className="form-input" maxLength="4" />
                </div>
              </div>
              <div className="form-group">
                <label>Tên trên thẻ</label>
                <input type="text" name="cardName" required className="form-input" defaultValue={editPayment.cardName} />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => { setShowEditPaymentForm(false); setEditPayment(null); }} className="cancel-btn">Hủy</button>
                <button type="submit" className="save-btn">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountProfile;