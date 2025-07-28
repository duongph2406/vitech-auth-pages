/**
 * Address management component
 */

import React, { memo, useState, useCallback, useEffect } from 'react';
import { useAuth } from '../../../store/authStore';
import dataService from '../../../services/dataService';
import { FormField } from '../../shared/components/FormField';
import { Button } from '../../shared/components/Button';
import { Card } from '../../shared/components/Card';
import { Toast } from '../../shared/components/Toast';
import { ConfirmDialog } from '../../shared/components/ConfirmDialog';

const AddressManager = memo(() => {
  const { state } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [formData, setFormData] = useState({
    type: 'Home',
    address: '',
    city: '',
    country: 'Vietnam'
  });

  useEffect(() => {
    if (state.user?.addresses) {
      setAddresses(state.user.addresses);
    }
  }, [state.user]);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      type: 'Home',
      address: '',
      city: '',
      country: 'Vietnam'
    });
  }, []);

  const handleAddAddress = useCallback(() => {
    setShowAddForm(true);
    setEditingAddress(null);
    resetForm();
  }, [resetForm]);

  const handleEditAddress = useCallback((address) => {
    setEditingAddress(address);
    setShowAddForm(true);
    setFormData({
      type: address.type,
      address: address.address,
      city: address.city,
      country: address.country
    });
  }, []);

  const handleCancelForm = useCallback(() => {
    setShowAddForm(false);
    setEditingAddress(null);
    resetForm();
  }, [resetForm]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!formData.address || !formData.city) {
      showToast('error', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    setIsSubmitting(true);

    try {
      let result;
      if (editingAddress) {
        result = await dataService.updateAddress(state.user.id, editingAddress.id, formData);
      } else {
        result = await dataService.addAddress(state.user.id, formData);
      }

      if (result) {
        // Refresh addresses
        const updatedUser = await dataService.getUserById(state.user.id);
        setAddresses(updatedUser.addresses || []);
        
        setShowAddForm(false);
        setEditingAddress(null);
        resetForm();
        showToast('success', editingAddress ? 'Cập nhật địa chỉ thành công!' : 'Thêm địa chỉ thành công!');
      } else {
        showToast('error', 'Có lỗi xảy ra khi lưu địa chỉ');
      }
    } catch (error) {
      showToast('error', 'Có lỗi xảy ra khi lưu địa chỉ');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, editingAddress, state.user, resetForm, showToast]);

  const handleDeleteAddress = useCallback((addressId) => {
    setAddressToDelete(addressId);
    setShowDeleteConfirm(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!addressToDelete) return;

    try {
      const success = await dataService.deleteAddress(state.user.id, addressToDelete);
      
      if (success) {
        // Refresh addresses
        const updatedUser = await dataService.getUserById(state.user.id);
        setAddresses(updatedUser.addresses || []);
        showToast('success', 'Xóa địa chỉ thành công!');
      } else {
        showToast('error', 'Có lỗi xảy ra khi xóa địa chỉ');
      }
    } catch (error) {
      showToast('error', 'Có lỗi xảy ra khi xóa địa chỉ');
    } finally {
      setShowDeleteConfirm(false);
      setAddressToDelete(null);
    }
  }, [addressToDelete, state.user, showToast]);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirm(false);
    setAddressToDelete(null);
  }, []);

  const handleInputChange = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  return (
    <div className="address-manager">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Xóa địa chỉ"
        message="Bạn có chắc chắn muốn xóa địa chỉ này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <div className="address-manager__header">
        <h2>Địa chỉ của tôi</h2>
        <Button
          variant="primary"
          onClick={handleAddAddress}
          disabled={showAddForm}
        >
          Thêm địa chỉ
        </Button>
      </div>

      {showAddForm && (
        <Card className="address-manager__form">
          <h3>{editingAddress ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}</h3>
          <form onSubmit={handleSubmit}>
            <FormField
              label="Loại địa chỉ"
              value={formData.type}
              onChange={(value) => handleInputChange('type', value)}
              as="select"
            >
              <option value="Home">Nhà riêng</option>
              <option value="Office">Văn phòng</option>
              <option value="Other">Khác</option>
            </FormField>

            <FormField
              label="Địa chỉ"
              value={formData.address}
              onChange={(value) => handleInputChange('address', value)}
              placeholder="Số nhà, tên đường"
              required
            />

            <FormField
              label="Thành phố"
              value={formData.city}
              onChange={(value) => handleInputChange('city', value)}
              required
            />

            <FormField
              label="Quốc gia"
              value={formData.country}
              onChange={(value) => handleInputChange('country', value)}
              required
            />

            <div className="address-manager__form-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancelForm}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                {editingAddress ? 'Cập nhật' : 'Thêm địa chỉ'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="address-manager__list">
        {addresses.map(address => (
          <Card key={address.id} className="address-manager__item">
            <div className="address-manager__item-content">
              <div className="address-manager__item-info">
                <div className="address-manager__item-header">
                  <span className="address-manager__item-type">{address.type}</span>
                  {address.isDefault && (
                    <span className="address-manager__item-badge">Mặc định</span>
                  )}
                </div>
                <p className="address-manager__item-text">
                  {address.address}<br />
                  {address.city}, {address.country}
                </p>
              </div>
              <div className="address-manager__item-actions">
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => handleEditAddress(address)}
                >
                  Sửa
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => handleDeleteAddress(address.id)}
                >
                  Xóa
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {addresses.length === 0 && !showAddForm && (
          <Card className="address-manager__empty">
            <p>Chưa có địa chỉ nào. Thêm địa chỉ đầu tiên của bạn.</p>
          </Card>
        )}
      </div>
    </div>
  );
});

AddressManager.displayName = 'AddressManager';

export { AddressManager };