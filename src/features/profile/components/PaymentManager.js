/**
 * Payment method management component
 */

import React, { memo, useState, useCallback, useEffect } from 'react';
import { useAuth } from '../../../store/authStore';
import dataService from '../../../services/dataService';
import { FormField } from '../../shared/components/FormField';
import { Button } from '../../shared/components/Button';
import { Card } from '../../shared/components/Card';
import { Toast } from '../../shared/components/Toast';
import { ConfirmDialog } from '../../shared/components/ConfirmDialog';

const PaymentManager = memo(() => {
  const { state } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  const [formData, setFormData] = useState({
    cardType: 'Visa',
    cardNumber: '',
    expiry: '',
    cardName: ''
  });

  useEffect(() => {
    if (state.user?.paymentMethods) {
      setPaymentMethods(state.user.paymentMethods);
    }
  }, [state.user]);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      cardType: 'Visa',
      cardNumber: '',
      expiry: '',
      cardName: ''
    });
  }, []);

  const handleAddPayment = useCallback(() => {
    setShowAddForm(true);
    setEditingPayment(null);
    resetForm();
  }, [resetForm]);

  const handleEditPayment = useCallback((payment) => {
    setEditingPayment(payment);
    setShowAddForm(true);
    setFormData({
      cardType: payment.type,
      cardNumber: `****${payment.last4}`,
      expiry: payment.expiry,
      cardName: payment.cardName
    });
  }, []);

  const handleCancelForm = useCallback(() => {
    setShowAddForm(false);
    setEditingPayment(null);
    resetForm();
  }, [resetForm]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!formData.cardNumber || !formData.expiry || !formData.cardName) {
      showToast('error', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Validate card number (basic validation)
    const cleanCardNumber = formData.cardNumber.replace(/\D/g, '');
    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      showToast('error', 'Số thẻ không hợp lệ');
      return;
    }

    // Validate expiry format (MM/YY)
    if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) {
      showToast('error', 'Định dạng ngày hết hạn không hợp lệ (MM/YY)');
      return;
    }

    setIsSubmitting(true);

    try {
      const paymentData = {
        type: formData.cardType,
        last4: cleanCardNumber.slice(-4),
        expiry: formData.expiry,
        cardName: formData.cardName
      };

      let result;
      if (editingPayment) {
        result = await dataService.updatePaymentMethod(state.user.id, editingPayment.id, paymentData);
      } else {
        result = await dataService.addPaymentMethod(state.user.id, paymentData);
      }

      if (result) {
        // Refresh payment methods
        const updatedUser = await dataService.getUserById(state.user.id);
        setPaymentMethods(updatedUser.paymentMethods || []);
        
        setShowAddForm(false);
        setEditingPayment(null);
        resetForm();
        showToast('success', editingPayment ? 'Cập nhật thẻ thành công!' : 'Thêm thẻ thành công!');
      } else {
        showToast('error', 'Có lỗi xảy ra khi lưu thẻ');
      }
    } catch (error) {
      showToast('error', 'Có lỗi xảy ra khi lưu thẻ');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, editingPayment, state.user, resetForm, showToast]);

  const handleDeletePayment = useCallback((paymentId) => {
    setPaymentToDelete(paymentId);
    setShowDeleteConfirm(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!paymentToDelete) return;

    try {
      const success = await dataService.deletePaymentMethod(state.user.id, paymentToDelete);
      
      if (success) {
        // Refresh payment methods
        const updatedUser = await dataService.getUserById(state.user.id);
        setPaymentMethods(updatedUser.paymentMethods || []);
        showToast('success', 'Xóa thẻ thành công!');
      } else {
        showToast('error', 'Có lỗi xảy ra khi xóa thẻ');
      }
    } catch (error) {
      showToast('error', 'Có lỗi xảy ra khi xóa thẻ');
    } finally {
      setShowDeleteConfirm(false);
      setPaymentToDelete(null);
    }
  }, [paymentToDelete, state.user, showToast]);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirm(false);
    setPaymentToDelete(null);
  }, []);

  const handleInputChange = useCallback((name, value) => {
    if (name === 'cardNumber') {
      // Format card number
      const cleaned = value.replace(/\D/g, '');
      const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else if (name === 'expiry') {
      // Format expiry date
      const cleaned = value.replace(/\D/g, '');
      const formatted = cleaned.replace(/(\d{2})(\d{2})/, '$1/$2');
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  return (
    <div className="payment-manager">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Xóa thẻ thanh toán"
        message="Bạn có chắc chắn muốn xóa thẻ thanh toán này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <div className="payment-manager__header">
        <h2>Phương thức thanh toán</h2>
        <Button
          variant="primary"
          onClick={handleAddPayment}
          disabled={showAddForm}
        >
          Thêm thẻ
        </Button>
      </div>

      {showAddForm && (
        <Card className="payment-manager__form">
          <h3>{editingPayment ? 'Sửa thẻ' : 'Thêm thẻ mới'}</h3>
          <form onSubmit={handleSubmit}>
            <FormField
              label="Loại thẻ"
              value={formData.cardType}
              onChange={(value) => handleInputChange('cardType', value)}
              as="select"
            >
              <option value="Visa">Visa</option>
              <option value="Mastercard">Mastercard</option>
              <option value="JCB">JCB</option>
              <option value="American Express">American Express</option>
            </FormField>

            <FormField
              label="Số thẻ"
              value={formData.cardNumber}
              onChange={(value) => handleInputChange('cardNumber', value)}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              required
            />

            <FormField
              label="Ngày hết hạn"
              value={formData.expiry}
              onChange={(value) => handleInputChange('expiry', value)}
              placeholder="MM/YY"
              maxLength="5"
              required
            />

            <FormField
              label="Tên trên thẻ"
              value={formData.cardName}
              onChange={(value) => handleInputChange('cardName', value)}
              placeholder="NGUYEN VAN A"
              required
            />

            <div className="payment-manager__form-actions">
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
                {editingPayment ? 'Cập nhật' : 'Thêm thẻ'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="payment-manager__list">
        {paymentMethods.map(payment => (
          <Card key={payment.id} className="payment-manager__item">
            <div className="payment-manager__item-content">
              <div className="payment-manager__item-info">
                <div className="payment-manager__item-header">
                  <span className="payment-manager__item-type">{payment.type}</span>
                  {payment.isDefault && (
                    <span className="payment-manager__item-badge">Mặc định</span>
                  )}
                </div>
                <p className="payment-manager__item-text">
                  **** **** **** {payment.last4}<br />
                  Hết hạn: {payment.expiry}<br />
                  {payment.cardName}
                </p>
              </div>
              <div className="payment-manager__item-actions">
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => handleEditPayment(payment)}
                >
                  Sửa
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => handleDeletePayment(payment.id)}
                >
                  Xóa
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {paymentMethods.length === 0 && !showAddForm && (
          <Card className="payment-manager__empty">
            <p>Chưa có thẻ thanh toán nào. Thêm thẻ đầu tiên của bạn.</p>
          </Card>
        )}
      </div>
    </div>
  );
});

PaymentManager.displayName = 'PaymentManager';

export { PaymentManager };