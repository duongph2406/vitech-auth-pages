import { useEffect } from 'react';

/**
 * Hook để quản lý tiêu đề trang web động
 * @param {string} title - Tiêu đề trang
 * @param {string} suffix - Hậu tố (mặc định: "MyApp")
 */
export const usePageTitle = (title, suffix = 'ViTech Group') => {
  useEffect(() => {
    const previousTitle = document.title;
    
    if (title) {
      document.title = `${title} - ${suffix}`;
    } else {
      document.title = suffix;
    }

    // Cleanup: khôi phục tiêu đề cũ khi component unmount
    return () => {
      document.title = previousTitle;
    };
  }, [title, suffix]);
};

/**
 * Các tiêu đề trang được định nghĩa sẵn
 */
export const PAGE_TITLES = {
  LOGIN: 'Đăng nhập',
  SIGNUP: 'Đăng ký',
  PROFILE: 'Thông tin tài khoản',
  HOME: 'Trang chủ',
  DASHBOARD: 'Bảng điều khiển'
};