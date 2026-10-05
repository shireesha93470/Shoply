import React from 'react';
import './ProductPage.styles.css';

const StarRating = ({ rating, size = 14 }) => (
  <div className="star-rating" style={{ fontSize: size }} aria-label={`${rating} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < Math.round(rating) ? 'star star-filled' : 'star'}>
        ★
      </span>
    ))}
  </div>
);

const ProductGallery = ({ images, activeIndex, onSelectImage, discountPercent, isWishlisted, onToggleWishlist, ratingLabel }) => (
  <div className="gallery">
    <div className="gallery-blob" aria-hidden="true" />
    <div className="gallery-main">
      {discountPercent > 0 && <span className="gallery-badge gallery-badge-discount">{discountPercent}% off</span>}
      <button
        className={`gallery-badge gallery-badge-wishlist ${isWishlisted ? 'wishlisted' : ''}`}
        onClick={onToggleWishlist}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {isWishlisted ? '♥' : '♡'}
      </button>
      <div className="gallery-main-image" />
      {ratingLabel && (
        <div className="gallery-chip">
          <StarRating rating={ratingLabel.value} size={11} />
          <span>{ratingLabel.text}</span>
        </div>
      )}
    </div>
    <div className="gallery-thumbs">
      {images.map((img, i) => (
        <button
          key={img.id}
          className={`gallery-thumb ${i === activeIndex ? 'gallery-thumb-active' : ''}`}
          onClick={() => onSelectImage(i)}
          aria-label={`View image ${i + 1}`}
        />
      ))}
    </div>
  </div>
);

const AccordionSection = ({ id, title, isOpen, onToggle, children }) => (
  <div className="accordion-item">
    <button className="accordion-trigger" onClick={() => onToggle(id)} aria-expanded={isOpen}>
      <span>{title}</span>
      <span className={`accordion-icon ${isOpen ? 'accordion-icon-open' : ''}`}>⌄</span>
    </button>
    {isOpen && <div className="accordion-panel">{children}</div>}
  </div>
);

const ReviewBar = ({ label, percent }) => (
  <div className="review-bar-row">
    <span className="review-bar-label">{label}</span>
    <div className="review-bar-track">
      <div className="review-bar-fill" style={{ width: `${percent}%` }} />
    </div>
    <span className="review-bar-percent">{percent}%</span>
  </div>
);

const ProductPageComponent = ({
  product,
  activeImageIndex,
  selectedColor,
  selectedSize,
  quantity,
  isWishlisted,
  activeAccordion,
  relatedProducts,
  sizeError,
  onSelectImage,
  onSelectColor,
  onSelectSize,
  onQuantityChange,
  onToggleWishlist,
  onToggleAccordion,
  onAddToCart,
  onBuyNow,
  onRelatedProductClick,
}) => {
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-page">
      <div className="product-page-inner">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <span>Home</span> <span className="breadcrumb-sep">/</span> <span>{product.category}</span>{' '}
          <span className="breadcrumb-sep">/</span> <span className="breadcrumb-current">{product.name}</span>
        </nav>

        <div className="product-layout">
          <div className="gallery-col">
            <ProductGallery
              images={product.images}
              activeIndex={activeImageIndex}
              onSelectImage={onSelectImage}
              discountPercent={discountPercent}
              isWishlisted={isWishlisted}
              onToggleWishlist={onToggleWishlist}
              ratingLabel={{ value: product.rating, text: `${product.rating} (${product.reviewCount})` }}
            />
          </div>

          <div className="info-col">
            {product.badge && <span className="product-badge">{product.badge}</span>}
            <h1 className="product-name">{product.name}</h1>
            <div className="rating-row">
              <StarRating rating={product.rating} />
              <span className="rating-count">{product.reviewCount} reviews</span>
              <span className="rating-dot">•</span>
              <span className="stock-status">In stock</span>
            </div>

            <div className="price-row">
              <span className="price-current">₹{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="price-strike">₹{product.originalPrice}</span>
                  <span className="price-discount-tag">Save {discountPercent}%</span>
                </>
              )}
            </div>

            <p className="product-description">{product.description}</p>

            {product.colors && product.colors.length > 0 && (
              <div className="option-group">
                <span className="option-label">
                  Color: <strong>{selectedColor}</strong>
                </span>
                <div className="color-swatches">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      className={`color-swatch ${selectedColor === color.name ? 'color-swatch-active' : ''}`}
                      style={{ '--swatch': color.hex }}
                      onClick={() => onSelectColor(color.name)}
                      aria-label={color.name}
                      aria-pressed={selectedColor === color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="option-group">
                <span className="option-label">Size</span>
                <div className="size-options">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-option ${selectedSize === size ? 'size-option-active' : ''}`}
                      onClick={() => onSelectSize(size)}
                      aria-pressed={selectedSize === size}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {sizeError && <p className="field-error">{sizeError}</p>}
              </div>
            )}

            <div className="option-group">
              <span className="option-label">Quantity</span>
              <div className="qty-stepper">
                <button
                  className="qty-btn"
                  onClick={() => onQuantityChange(-1)}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="qty-value">{quantity}</span>
                <button className="qty-btn" onClick={() => onQuantityChange(1)} aria-label="Increase quantity">
                  +
                </button>
              </div>
            </div>

            <div className="cta-row">
              <button className="btn btn-ghost cta-btn" onClick={onAddToCart}>
                Add to cart
              </button>
              <button className="btn btn-primary cta-btn" onClick={onBuyNow}>
                Buy now
              </button>
            </div>

            <div className="delivery-card">
              <span className="delivery-icon">🚚</span>
              <div>
                <p className="delivery-title">Free delivery by {product.deliveryEstimate}</p>
                <p className="delivery-subtitle">Order within 4 hrs 12 mins</p>
              </div>
            </div>

            <div className="trust-row">
              <div className="trust-item">
                <span className="trust-icon">↩</span>
                <span>30-day returns</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">🔒</span>
                <span>Secure payment</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">✓</span>
                <span>Authentic product</span>
              </div>
            </div>
          </div>
        </div>

        <div className="accordion-section">
          <AccordionSection
            id="details"
            title="Product details"
            isOpen={activeAccordion === 'details'}
            onToggle={onToggleAccordion}
          >
            <ul className="detail-list">
              {product.details.map((detail, i) => (
                <li key={i}>{detail}</li>
              ))}
            </ul>
          </AccordionSection>
          <AccordionSection
            id="shipping"
            title="Shipping and returns"
            isOpen={activeAccordion === 'shipping'}
            onToggle={onToggleAccordion}
          >
            <p>Free standard shipping on orders over ₹999. Express delivery available at checkout.</p>
            <p>Returns accepted within 30 days of delivery, in original condition with tags attached.</p>
          </AccordionSection>
          <AccordionSection
            id="reviews"
            title={`Reviews (${product.reviewCount})`}
            isOpen={activeAccordion === 'reviews'}
            onToggle={onToggleAccordion}
          >
            <div className="review-summary">
              <div className="review-summary-score">
                <span className="review-summary-number">{product.rating}</span>
                <StarRating rating={product.rating} size={16} />
                <span className="review-summary-count">{product.reviewCount} reviews</span>
              </div>
              <div className="review-summary-bars">
                {product.ratingBreakdown.map((row) => (
                  <ReviewBar key={row.label} label={row.label} percent={row.percent} />
                ))}
              </div>
            </div>
          </AccordionSection>
        </div>

        {relatedProducts && relatedProducts.length > 0 && (
          <section className="related-section">
            <h2 className="section-title">You might also like</h2>
            <div className="related-row">
              {relatedProducts.map((item) => (
                <button key={item.id} className="related-card" onClick={() => onRelatedProductClick(item.id)}>
                  <div className="related-thumb">
                    {item.tag && <span className="related-tag">{item.tag}</span>}
                  </div>
                  <span className="related-name">{item.name}</span>
                  <span className="related-price">₹{item.price}</span>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="mobile-buy-bar">
        <div className="mobile-buy-price">
          <span className="price-current">₹{product.price}</span>
          {product.originalPrice && <span className="price-strike">₹{product.originalPrice}</span>}
        </div>
        <button className="btn btn-primary mobile-buy-btn" onClick={onBuyNow}>
          Buy now
        </button>
      </div>
    </div>
  );
};

export default ProductPageComponent;