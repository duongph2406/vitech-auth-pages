import { useState } from 'react';
import './AuthForm.css';
import namImage from '../../assets/ceo-avatar.jpg';
import { usePageTitle, PAGE_TITLES } from '../../hooks/usePageTitle';

function AuthForm({ 
  mode, // 'signin' or 'signup'
  onSubmit, 
  onSwitchMode, 
  error, 
  formData, 
  setFormData 
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const isSignUp = mode === 'signup';
  
  // Thiết lập tiêu đề trang động
  usePageTitle(isSignUp ? PAGE_TITLES.SIGNUP : PAGE_TITLES.LOGIN);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      onSubmit(e);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="App">
      <div className="auth-container">
        {/* Left Panel */}
        <div className="left-panel">
          <div className="logo-section">
            <img
              src="https://vitechgroup.vn/wp-content/uploads/2022/11/logo.png"
              alt="ViTech Logo"
              className="logo"
            />
          </div>

          <div className="quote-section">
            <div className="profile">
              <div className="avatar">
                <img
                  src={namImage}
                  alt="Lê Đức Nam"
                  className="avatar-image"
                />
              </div>
              <div className="profile-info">
                <h3>Lê Đức Nam</h3>
                <p>Chairman, CEO</p>
              </div>
            </div>

            <blockquote className="quote">
              {isSignUp 
                ? "Hãy tham gia cùng chúng tôi để xây dựng tương lai công nghệ và tạo ra những giá trị bền vững cho cộng đồng."
                : "Chúng tôi truyền tải thông điệp của giá trị cốt lõi bền vững được tạo ra từ những con người phù hợp tại ViTech và đặt tiêu chí con người là quan trọng nhất."
              }
            </blockquote>
          </div>

          <div className="copyright">
            Copyright © 2019 - 2021 by ViTech Group Company
          </div>
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          <div className="auth-form">
            <div className="form-header">
              <h2>{isSignUp ? 'Create Account' : 'Welcome back!'}</h2>
              <p className="subtitle">
                {isSignUp 
                  ? 'Please fill in your information to create an account!'
                  : 'Please enter your credentials to sign in!'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}

              {/* Sign Up Fields */}
              {isSignUp && (
                <>
                  <div className="form-row">
                    <div className="form-group half">
                      <label htmlFor="firstName">First Name</label>
                      <div className="input-wrapper">
                        <input
                          id="firstName"
                          type="text"
                          name="firstName"
                          placeholder="John"
                          className="form-input"
                          value={formData.firstName || ''}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group half">
                      <label htmlFor="lastName">Last Name</label>
                      <div className="input-wrapper">
                        <input
                          id="lastName"
                          type="text"
                          name="lastName"
                          placeholder="Doe"
                          className="form-input"
                          value={formData.lastName || ''}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <div className="input-wrapper">
                      <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="john.doe@example.com"
                        className="form-input"
                        value={formData.email || ''}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="form-group">
                <label htmlFor="username">User Name</label>
                <div className="input-wrapper">
                  <input
                    id="username"
                    type="text"
                    name="username"
                    placeholder={isSignUp ? "johndoe" : "Enter your username"}
                    className="form-input"
                    value={formData.username || ''}
                    onChange={handleInputChange}
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder={isSignUp ? "••••••••" : "Enter your password"}
                    className="form-input"
                    value={formData.password || ''}
                    onChange={handleInputChange}
                    required
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                  />
                  <button 
                    type="button" 
                    className="eye-button"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? '👁️' : '🔒'}
                  </button>
                </div>
              </div>

              {/* Confirm Password for Sign Up */}
              {isSignUp && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-wrapper">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="••••••••"
                      className="form-input"
                      value={formData.confirmPassword || ''}
                      onChange={handleInputChange}
                      required
                      autoComplete="new-password"
                    />
                    <button 
                      type="button" 
                      className="eye-button"
                      onClick={toggleConfirmPasswordVisibility}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? '👁️' : '🔒'}
                    </button>
                  </div>
                </div>
              )}

              <div className="form-options">
                {isSignUp ? (
                  <label className="checkbox-label">
                    <input type="checkbox" required />
                    <span className="checkmark"></span>
                    I agree to the <button type="button" className="terms-link">Terms & Conditions</button>
                  </label>
                ) : (
                  <>
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span className="checkmark"></span>
                      Remember Me
                    </label>
                    <button type="button" className="forgot-link">
                      Forgot Password?
                    </button>
                  </>
                )}
              </div>

              <button type="submit" className="auth-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="loading-spinner">⏳</span>
                    <span className="btn-text">{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                  </>
                ) : (
                  <>
                    <span className="btn-text">{isSignUp ? 'Create Account' : 'Sign In'}</span>
                    <span className="btn-icon">→</span>
                  </>
                )}
              </button>

              <div className="switch-section">
                <p className="switch-text">
                  {isSignUp ? 'Already have an account?' : "Don't have an account yet?"} 
                  <button 
                    type="button" 
                    onClick={onSwitchMode} 
                    className="switch-link"
                  >
                    {isSignUp ? 'Sign in' : 'Sign up'}
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;