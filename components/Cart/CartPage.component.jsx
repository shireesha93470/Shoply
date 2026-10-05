import React, { useState } from 'react';
import './CartPage.styles.css';

const CartItem = ({ item, onQuantityChange, onRemoveItem }) => (
  <div className="cart-item">
    <div className="cart-item-thumb" />
    <div className="cart-item-info">
      <div className="cart-item-top">
        <span className="cart-item-name">{item.name}</span>
        <button
          className="cart-item-remove"
          onClick={() => onRemoveItem(item.id)}
          aria-label={`Remove ${item.name} from cart`}
        >
          Remove
        </button>
      </div>
      {(item.size || item.color) && (
        <div className="cart-item-variants">
          {item.color && <span className="variant-chip">{item.color}</span>}
          {item.size && <span className="variant-chip">Size {item.size}</span>}
        </div>
      )}
      <div className="cart-item-bottom">
        <div className="qty-stepper">
          <button
            className="qty-btn"
            onClick={() => onQuantityChange(item.id, -1)}
            disabled={item.quantity <= 1}
            aria-label={`Decrease quantity of ${item.name}`}
          >
            −
          </button>
          <span className="qty-value">{item.quantity}</span>
          <button
            className="qty-btn"
            onClick={() => onQuantityChange(item.id, 1)}
            aria-label={`Increase quantity of ${item.name}`}
          >
            +
          </button>
        </div>
        <div className="cart-item-price">
          {item.originalPrice && item.originalPrice > item.price && (
            <span className="price-strike">₹{item.originalPrice * item.quantity}</span>
          )}
          <span className="price-current">₹{item.price * item.quantity}</span>
        </div>
      </div>
    </div>
  </div>
);

const EmptyCart = ({ onContinueShopping }) => (
  <div className="empty-cart">
    <div className="empty-cart-blobs" aria-hidden="true">
      <div className="empty-blob empty-blob-a" />
      <div className="empty-blob empty-blob-b" />
      <span className="empty-heart">♡</span>
    </div>
    <h2 className="empty-cart-title">Your cart is feeling light</h2>
    <p className="empty-cart-subtitle">Nothing here yet — let's fix that.</p>
    <button className="btn btn-primary" onClick={onContinueShopping}>
      Continue shopping
    </button>
  </div>
);

const CartPageComponent = ({
  cartItems,
  recommendedProducts,
  loading,
  subtotal,
  discountAmount,
  shippingCost,
  total,
  freeShippingThreshold,
  amountToFreeShipping,
  promoCode,
  promoApplied,
  promoError,
  onQuantityChange,
  onRemoveItem,
  onPromoCodeChange,
  onApplyPromo,
  onCheckout,
  onProductClick,
  onContinueShopping,
}) => {
  const [localPromo, setLocalPromo] = useState(promoCode || '');
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    onApplyPromo(localPromo);
  };

  return (
    <div className="cart-page">
      <header className="cart-header">
        <div className="cart-logo">
          Shoply<span className="logo-dot">.</span>
        </div>
        <button className="cart-continue-link" onClick={onContinueShopping}>
          ← Continue shopping
        </button>
      </header>

      <div className="cart-page-inner">
        <div className="cart-title-row">
          <h1 className="cart-title">Your cart</h1>
          {itemCount > 0 && <span className="cart-count-pill">{itemCount} items</span>}
        </div>

        {loading ? (
          <div className="cart-layout">
            <div className="cart-items-col">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="cart-item skeleton" style={{ height: 128 }} />
              ))}
            </div>
            <div className="cart-summary-col">
              <div className="order-summary skeleton" style={{ height: 320 }} />
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          <EmptyCart onContinueShopping={onContinueShopping} />
        ) : (
          <div className="cart-layout">
            <div className="cart-items-col">
              {subtotal < freeShippingThreshold && (
                <div className="shipping-progress-card">
                  <p className="shipping-progress-text">
                    Add <strong>₹{amountToFreeShipping}</strong> more for free shipping
                  </p>
                  <div className="shipping-progress-track">
                    <div className="shipping-progress-fill" style={{ width: `${shippingProgress}%` }} />
                  </div>
                </div>
              )}
              {subtotal >= freeShippingThreshold && (
                <div className="shipping-progress-card shipping-progress-done">
                  <p className="shipping-progress-text">🎉 You've unlocked free shipping</p>
                </div>
              )}

              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={onQuantityChange}
                  onRemoveItem={onRemoveItem}
                />
              ))}
            </div>

            <div className="cart-summary-col">
              <div className="order-summary">
                <div className="order-summary-blob" aria-hidden="true" />
                <h2 className="order-summary-title">Order summary</h2>

                <form className="promo-form" onSubmit={handlePromoSubmit}>
                  <input
                    type="text"
                    className="promo-input"
                    placeholder="Promo code"
                    value={localPromo}
                    onChange={(e) => setLocalPromo(e.target.value)}
                    aria-label="Promo code"
                  />
                  <button type="submit" className="promo-apply-btn">
                    Apply
                  </button>
                </form>
                {promoError && <p className="promo-error">{promoError}</p>}
                {promoApplied && <p className="promo-success">Promo code applied</p>}

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
                </div>

                <div className="summary-divider" />

                <div className="summary-row summary-row-total">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>

                <button className="btn btn-primary checkout-btn" onClick={onCheckout}>
                  Checkout — ₹{total}
                </button>
                <p className="secure-note">🔒 Secure checkout · Easy 30-day returns</p>
              </div>
            </div>
          </div>
        )}

        {recommendedProducts && recommendedProducts.length > 0 && (
          <section className="recommended-section">
            <h2 className="section-title">You might also like</h2>
            <div className="recommended-row">
              {recommendedProducts.map((product) => (
                <button
                  key={product.id}
                  className="product-card"
                  onClick={() => onProductClick(product.id)}
                >
                  <div className="product-thumb">
                    {product.tag && <span className="product-tag">{product.tag}</span>}
                    <span className="quick-add">Quick add +</span>
                  </div>
                  <span className="product-name">{product.name}</span>
                  <span className="product-price">₹{product.price}</span>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CartPageComponent;