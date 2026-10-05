import React, { useState } from 'react';
import PaymentPageComponent from './PaymentPage.component';

const MOCK_ORDER_ITEMS = [
  { id: 1, name: 'Classic Sneakers', variant: 'White · UK 9', price: 2249, quantity: 1 },
  { id: 2, name: 'Everyday Hoodie', variant: 'Charcoal · M', price: 1899, quantity: 2 },
  { id: 3, name: 'Aviator Sunglasses', variant: 'Gold', price: 899, quantity: 1 },
];

const SUBTOTAL = MOCK_ORDER_ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0);
const DISCOUNT_AMOUNT = 0;
const SHIPPING_COST = 0;

const EMPTY_FORM = {
  email: '',
  phone: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvv: '',
  cardName: '',
  upiId: '',
};

const validate = (formData, paymentMethod) => {
  const errors = {};
  if (!formData.email.trim()) errors.email = 'Enter your email';
  else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = 'Enter a valid email';

  if (!formData.phone.trim()) errors.phone = 'Enter your phone number';
  else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) errors.phone = 'Enter a valid 10-digit number';

  if (!formData.firstName.trim()) errors.firstName = 'Required';
  if (!formData.lastName.trim()) errors.lastName = 'Required';
  if (!formData.address.trim()) errors.address = 'Required';
  if (!formData.city.trim()) errors.city = 'Required';
  if (!formData.state.trim()) errors.state = 'Required';
  if (!/^\d{6}$/.test(formData.pincode.trim())) errors.pincode = 'Enter a valid 6-digit PIN';

  if (paymentMethod === 'card') {
    if (formData.cardNumber.replace(/\s/g, '').length !== 16) errors.cardNumber = 'Enter a valid 16-digit card number';
    if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) errors.cardExpiry = 'Use MM/YY';
    if (formData.cardCvv.length < 3) errors.cardCvv = 'Enter a valid CVV';
    if (!formData.cardName.trim()) errors.cardName = 'Required';
  }
  if (paymentMethod === 'upi') {
  if (!/^[\w.-]+@\w+$/.test(formData.upiId.trim())) errors.upiId = 'Enter a valid UPI ID';
}

  return errors;
};

const PaymentPageContainer = () => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(formData, paymentMethod);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    // Replace with a real payment/order API call, e.g.:
    // fetch('/api/orders', { method: 'POST', body: JSON.stringify({ formData, paymentMethod }) })
    setTimeout(() => {
      console.log('Order placed', { formData, paymentMethod });
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <PaymentPageComponent
      formData={formData}
      errors={errors}
      paymentMethod={paymentMethod}
      orderItems={MOCK_ORDER_ITEMS}
      subtotal={SUBTOTAL}
      discountAmount={DISCOUNT_AMOUNT}
      shippingCost={SHIPPING_COST}
      total={SUBTOTAL - DISCOUNT_AMOUNT + SHIPPING_COST}
      isSubmitting={isSubmitting}
      onFieldChange={handleFieldChange}
      onPaymentMethodChange={handlePaymentMethodChange}
      onSubmit={handleSubmit}
    />
  );
};

export default PaymentPageContainer;