import React, { useState, useEffect, useMemo } from 'react';
import CartPageComponent from './CartPage.component';

const FREE_SHIPPING_THRESHOLD = 1999;
const SHIPPING_COST = 99;

const MOCK_CART_ITEMS = [
  { id: 1, name: 'Classic Sneakers', price: 2249, originalPrice: 2499, color: 'White', size: 'UK 9', quantity: 1 },
  { id: 2, name: 'Everyday Hoodie', price: 1899, originalPrice: null, color: 'Charcoal', size: 'M', quantity: 2 },
  { id: 3, name: 'Aviator Sunglasses', price: 899, originalPrice: 999, color: 'Gold', size: null, quantity: 1 },
];

const MOCK_RECOMMENDED = [
  { id: 4, name: 'Slim Fit Jeans', price: 2199, tag: null },
  { id: 5, name: 'Oversized Tee', price: 799, tag: 'New' },
  { id: 6, name: 'Wool Beanie', price: 599, tag: 'Sale' },
  { id: 7, name: 'Canvas Sneakers', price: 1599, tag: 'Trending' },
];

const VALID_PROMO_CODES = {
  SAVE10: 0.1,
  WELCOME5: 0.05,
};

const CartPageContainer = () => {
  const [cartItems, setCartItems] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(null);
  const [promoError, setPromoError] = useState('');

  useEffect(() => {
    // Replace with real API calls, e.g.:
    // fetch('/api/cart').then(res => res.json()).then(setCartItems)
    const timer = setTimeout(() => {
      setCartItems(MOCK_CART_ITEMS);
      setRecommendedProducts(MOCK_RECOMMENDED);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );
  const discountAmount = promoApplied ? Math.round(subtotal * promoApplied) : 0;
  const shippingCost = subtotal - discountAmount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal - discountAmount + shippingCost;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleQuantityChange = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleApplyPromo = (code) => {
    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      setPromoError('Enter a code first');
      setPromoApplied(null);
      return;
    }
    if (VALID_PROMO_CODES[normalized]) {
      setPromoApplied(VALID_PROMO_CODES[normalized]);
      setPromoError('');
      setPromoCode(normalized);
    } else {
      setPromoApplied(null);
      setPromoError("That code isn't valid");
    }
  };

  const handleCheckout = () => {
    console.log('Proceed to checkout', { cartItems, total });
  };

  const handleProductClick = (productId) => {
    console.log('Navigate to product:', productId);
  };

  const handleContinueShopping = () => {
    console.log('Navigate back to shop');
  };

  return (
    <CartPageComponent
      cartItems={cartItems}
      recommendedProducts={recommendedProducts}
      loading={loading}
      subtotal={subtotal}
      discountAmount={discountAmount}
      shippingCost={shippingCost}
      total={total}
      freeShippingThreshold={FREE_SHIPPING_THRESHOLD}
      amountToFreeShipping={amountToFreeShipping}
      promoCode={promoCode}
      promoApplied={promoApplied}
      promoError={promoError}
      onQuantityChange={handleQuantityChange}
      onRemoveItem={handleRemoveItem}
      onApplyPromo={handleApplyPromo}
      onCheckout={handleCheckout}
      onProductClick={handleProductClick}
      onContinueShopping={handleContinueShopping}
    />
  );
};

export default CartPageContainer;