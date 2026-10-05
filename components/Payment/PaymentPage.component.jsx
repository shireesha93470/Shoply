import React, { useState } from 'react';
import './PaymentPage.styles.css';

const StepTracker = ({ currentStep }) => {
  const steps = ['Cart', 'Shipping', 'Payment'];
  return (
    <div className="step-tracker" aria-label="Checkout progress">
      {steps.map((step, i) => (
        <React.Fragment key={step}>
          <div className={`step ${i <= currentStep ? 'step-active' : ''}`}>
            <span className="step-dot">{i < currentStep ? '✓' : i + 1}</span>
            <span className="step-label">{step}</span>
          </div>
          {i < steps.length - 1 && <div className={`step-line ${i < currentStep ? 'step-line-active' : ''}`} />}
        </React.Fragment>
      ))}
    </div>
  );
};

const FieldError = ({ message }) => (message ? <p className="field-error">{message}</p> : null);

const PaymentPageComponent = ({
  formData,
  errors,
  paymentMethod,
  orderItems,
  subtotal,
  discountAmount,
  shippingCost,
  total,
  isSubmitting,
  onFieldChange,
  onPaymentMethodChange,
  onSubmit,
}) => {
  const [cardNumberDisplay, setCardNumberDisplay] = useState(formData.cardNumber || '');

  const handleCardNumberInput = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
    const grouped = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumberDisplay(grouped);
    onFieldChange('cardNumber', digits);
  };

  const handleExpiryInput = (e) => {
    let digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) digits = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    onFieldChange('cardExpiry', digits);
  };

  return (
    <div className="payment-page">
      <header className="payment-header">
        <div className="payment-logo">
          Shoply<span className="logo-dot">.</span>
        </div>
        <span className="secure-badge">🔒 Secure checkout</span>
      </header>

      <div className="payment-page-inner">
        <StepTracker currentStep={2} />

        <form className="payment-layout" onSubmit={onSubmit} noValidate>
          <div className="payment-form-col">
            {/* Contact */}
            <section className="form-card">
              <h2 className="form-card-title">Contact</h2>
              <div className="field-group">
                <label className="field-label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className={`field-input ${errors.email ? 'field-input-error' : ''}`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => onFieldChange('email', e.target.value)}
                />
                <FieldError message={errors.email} />
              </div>
              <div className="field-group">
                <label className="field-label" htmlFor="phone">
                  Phone number
                </label>
                <input
                  id="phone"
                  type="tel"
                  className={`field-input ${errors.phone ? 'field-input-error' : ''}`}
                  placeholder="98765 43210"
                  value={formData.phone}
                  onChange={(e) => onFieldChange('phone', e.target.value)}
                />
                <FieldError message={errors.phone} />
              </div>
            </section>

            {/* Shipping address */}
            <section className="form-card">
              <h2 className="form-card-title">Shipping address</h2>
              <div className="field-row">
                <div className="field-group">
                  <label className="field-label" htmlFor="firstName">
                    First name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    className={`field-input ${errors.firstName ? 'field-input-error' : ''}`}
                    value={formData.firstName}
                    onChange={(e) => onFieldChange('firstName', e.target.value)}
                  />
                  <FieldError message={errors.firstName} />
                </div>
                <div className="field-group">
                  <label className="field-label" htmlFor="lastName">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className={`field-input ${errors.lastName ? 'field-input-error' : ''}`}
                    value={formData.lastName}
                    onChange={(e) => onFieldChange('lastName', e.target.value)}
                  />
                  <FieldError message={errors.lastName} />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="address">
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  className={`field-input ${errors.address ? 'field-input-error' : ''}`}
                  placeholder="House number and street name"
                  value={formData.address}
                  onChange={(e) => onFieldChange('address', e.target.value)}
                />
                <FieldError message={errors.address} />
              </div>

              <div className="field-row">
                <div className="field-group">
                  <label className="field-label" htmlFor="city">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    className={`field-input ${errors.city ? 'field-input-error' : ''}`}
                    value={formData.city}
                    onChange={(e) => onFieldChange('city', e.target.value)}
                  />
                  <FieldError message={errors.city} />
                </div>
                <div className="field-group">
                  <label className="field-label" htmlFor="state">
                    State
                  </label>
                  <input
                    id="state"
                    type="text"
                    className={`field-input ${errors.state ? 'field-input-error' : ''}`}
                    value={formData.state}
                    onChange={(e) => onFieldChange('state', e.target.value)}
                  />
                  <FieldError message={errors.state} />
                </div>
                <div className="field-group field-group-narrow">
                  <label className="field-label" htmlFor="pincode">
                    PIN code
                  </label>
                  <input
                    id="pincode"
                    type="text"
                    className={`field-input ${errors.pincode ? 'field-input-error' : ''}`}
                    value={formData.pincode}
                    onChange={(e) => onFieldChange('pincode', e.target.value)}
                  />
                  <FieldError message={errors.pincode} />
                </div>
              </div>
            </section>

            {/* Payment method */}
            <section className="form-card">
              <h2 className="form-card-title">Payment method</h2>
              <div className="payment-method-tabs" role="tablist">
                {['card', 'upi', 'cod'].map((method) => (
                  <button
                    type="button"
                    key={method}
                    role="tab"
                    aria-selected={paymentMethod === method}
                    className={`method-tab ${paymentMethod === method ? 'method-tab-active' : ''}`}
                    onClick={() => onPaymentMethodChange(method)}
                  >
                    {method === 'card' && '💳 Card'}
                    {method === 'upi' && '📱 UPI'}
                    {method === 'cod' && '💵 Cash on delivery'}
                  </button>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <div className="method-panel">
                  <div className="field-group">
                    <label className="field-label" htmlFor="cardNumber">
                      Card number
                    </label>
                    <input
                      id="cardNumber"
                      type="text"
                      inputMode="numeric"
                      className={`field-input ${errors.cardNumber ? 'field-input-error' : ''}`}
                      placeholder="1234 5678 9012 3456"
                      value={cardNumberDisplay}
                      onChange={handleCardNumberInput}
                      maxLength={19}
                    />
                    <FieldError message={errors.cardNumber} />
                  </div>
                  <div className="field-row">
                    <div className="field-group">
                      <label className="field-label" htmlFor="cardExpiry">
                        Expiry
                      </label>
                      <input
                        id="cardExpiry"
                        type="text"
                        inputMode="numeric"
                        className={`field-input ${errors.cardExpiry ? 'field-input-error' : ''}`}
                        placeholder="MM/YY"
                        value={formData.cardExpiry}
                        onChange={handleExpiryInput}
                        maxLength={5}
                      />
                      <FieldError message={errors.cardExpiry} />
                    </div>
                    <div className="field-group field-group-narrow">
                      <label className="field-label" htmlFor="cardCvv">
                        CVV
                      </label>
                      <input
                        id="cardCvv"
                        type="password"
                        inputMode="numeric"
                        className={`field-input ${errors.cardCvv ? 'field-input-error' : ''}`}
                        placeholder="123"
                        maxLength={4}
                        value={formData.cardCvv}
                        onChange={(e) => onFieldChange('cardCvv', e.target.value.replace(/\D/g, ''))}
                      />
                      <FieldError message={errors.cardCvv} />
                    </div>
                  </div>
                  <div className="field-group">
                    <label className="field-label" htmlFor="cardName">
                      Name on card
                    </label>
                    <input
                      id="cardName"
                      type="text"
                      className={`field-input ${errors.cardName ? 'field-input-error' : ''}`}
                      value={formData.cardName}
                      onChange={(e) => onFieldChange('cardName', e.target.value)}
                    />
                    <FieldError message={errors.cardName} />
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="method-panel">
                  <div className="field-group">
                    <label className="field-label" htmlFor="upiId">
                      UPI ID
                    </label>
                    <input
                      id="upiId"
                      type="text"
                      className={`field-input ${errors.upiId ? 'field-input-error' : ''}`}
                      placeholder="yourname@upi"
                      value={formData.upiId}
                      onChange={(e) => onFieldChange('upiId', e.target.value)}
                    />
                    <FieldError message={errors.upiId} />
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="method-panel cod-note">
                  <p>Pay with cash when your order arrives. A small ₹49 COD fee applies.</p>
                </div>
              )}
            </section>
          </div>

          <div className="payment-summary-col">
            <div className="order-summary">
              <div className="order-summary-blob" aria-hidden="true" />
              <h2 className="order-summary-title">Order summary</h2>

              <div className="summary-items">
                {orderItems.map((item) => (
                  <div className="summary-item" key={item.id}>
                    <div className="summary-item-thumb">
                      <span className="summary-item-qty">{item.quantity}</span>
                    </div>
                    <div className="summary-item-info">
                      <span className="summary-item-name">{item.name}</span>
                      {item.variant && <span className="summary-item-variant">{item.variant}</span>}
                    </div>
                    <span className="summary-item-price">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="summary-divider" />

              <div className="summary-rows">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="summary-row summary-row-discount">
                    <span>Discount</span>
                    <span>−₹{discountAmount}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
                </div>
                {paymentMethod === 'cod' && (
                  <div className="summary-row">
                    <span>COD fee</span>
                    <span>₹49</span>
                  </div>
                )}
              </div>

              <div className="summary-divider" />

              <div className="summary-row summary-row-total">
                <span>Total</span>
                <span>₹{total + (paymentMethod === 'cod' ? 49 : 0)}</span>
              </div>

              <button type="submit" className="btn btn-primary place-order-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Placing order…' : `Place order — ₹${total + (paymentMethod === 'cod' ? 49 : 0)}`}
              </button>
              <p className="secure-note">🔒 Your payment info is encrypted and secure</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentPageComponent;