import React, { useState } from 'react';
import ProductPageComponent from './ProductPage.component';

const MOCK_PRODUCT = {
  id: 101,
  category: 'Sneakers',
  name: 'Classic Court Sneakers',
  badge: 'Bestseller',
  rating: 4.6,
  reviewCount: 328,
  price: 2249,
  originalPrice: 2999,
  description:
    'A clean, everyday sneaker built on a cushioned sole with a breathable canvas upper. Designed to go from errands to weekends without missing a beat.',
  deliveryEstimate: 'Sat, 23 Aug',
  images: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
  colors: [
    { name: 'White', hex: '#f5f4ef' },
    { name: 'Charcoal', hex: '#4a4658' },
    { name: 'Sage', hex: '#8fae9a' },
  ],
  sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
  details: [
    'Breathable canvas upper with reinforced toe cap',
    'Cushioned EVA midsole for all-day comfort',
    'Rubber outsole with multi-directional grip',
    'Padded collar and tongue',
  ],
  ratingBreakdown: [
    { label: '5 star', percent: 68 },
    { label: '4 star', percent: 21 },
    { label: '3 star', percent: 7 },
    { label: '2 star', percent: 3 },
    { label: '1 star', percent: 1 },
  ],
};

const MOCK_RELATED = [
  { id: 201, name: 'Everyday Hoodie', price: 1899, tag: 'Trending' },
  { id: 202, name: 'Slim Fit Jeans', price: 2199, tag: null },
  { id: 203, name: 'Aviator Sunglasses', price: 999, tag: 'Sale' },
  { id: 204, name: 'Canvas Tote Bag', price: 799, tag: 'New' },
];

const ProductPageContainer = () => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(MOCK_PRODUCT.colors[0].name);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState('details');
  const [sizeError, setSizeError] = useState('');

  const handleSelectImage = (index) => setActiveImageIndex(index);
  const handleSelectColor = (name) => setSelectedColor(name);
  const handleSelectSize = (size) => {
    setSelectedSize(size);
    setSizeError('');
  };
  const handleQuantityChange = (delta) => setQuantity((prev) => Math.max(1, prev + delta));
  const handleToggleWishlist = () => setIsWishlisted((prev) => !prev);
  const handleToggleAccordion = (id) => setActiveAccordion((prev) => (prev === id ? null : id));

  const requireSize = () => {
    if (MOCK_PRODUCT.sizes && !selectedSize) {
      setSizeError('Select a size first');
      return false;
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!requireSize()) return;
    console.log('Add to cart', { productId: MOCK_PRODUCT.id, selectedColor, selectedSize, quantity });
  };

  const handleBuyNow = () => {
    if (!requireSize()) return;
    console.log('Buy now', { productId: MOCK_PRODUCT.id, selectedColor, selectedSize, quantity });
  };

  const handleRelatedProductClick = (id) => {
    console.log('Navigate to product:', id);
  };

  return (
    <ProductPageComponent
      product={MOCK_PRODUCT}
      activeImageIndex={activeImageIndex}
      selectedColor={selectedColor}
      selectedSize={selectedSize}
      quantity={quantity}
      isWishlisted={isWishlisted}
      activeAccordion={activeAccordion}
      relatedProducts={MOCK_RELATED}
      sizeError={sizeError}
      onSelectImage={handleSelectImage}
      onSelectColor={handleSelectColor}
      onSelectSize={handleSelectSize}
      onQuantityChange={handleQuantityChange}
      onToggleWishlist={handleToggleWishlist}
      onToggleAccordion={handleToggleAccordion}
      onAddToCart={handleAddToCart}
      onBuyNow={handleBuyNow}
      onRelatedProductClick={handleRelatedProductClick}
    />
  );
};

export default ProductPageContainer;