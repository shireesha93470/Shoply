import React, { useState, useEffect, useRef } from 'react';
import './Home.styles.css';

// Scrolls a row left/right by ~85% of its visible width when an arrow is clicked
const useHorizontalScroll = () => {
  const ref = useRef(null);
  const scroll = (direction) => {
    if (!ref.current) return;
    const amount = ref.current.clientWidth * 0.85;
    ref.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };
  return [ref, scroll];
};

// Eases scrollLeft from its current value to a target over `duration` ms,
// so the row visibly glides instead of jumping.
const animateScrollLeft = (el, target, duration = 900) => {
  const start = el.scrollLeft;
  const change = target - start;
  const startTime = performance.now();

  const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

  const step = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    el.scrollLeft = start + change * easeInOutQuad(progress);
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };
  requestAnimationFrame(step);
};

// autoScroll: when true, glides the row forward by one "page" (~85% of its
// visible width) every autoScrollMs, looping back to the start once it
// reaches the end. Pauses on hover/touch so users can still browse manually.
const ScrollRow = ({ className, ariaLabel, children, autoScroll = false, autoScrollMs = 1000 }) => {
  const [ref, scroll] = useHorizontalScroll();
  const isPausedRef = useRef(false);

  useEffect(() => {
    if (!autoScroll) return undefined;

    const el0 = ref.current;
    // The row's CSS sets scroll-behavior: smooth (for the arrow buttons) and,
    // on the campaign banner row, scroll-snap-type: x mandatory. Both fight
    // with the manual eased animation below — snap in particular pulls the
    // row back to the nearest card right after each glide, which cancels the
    // movement out entirely. Switch to instant/no-snap while auto-scrolling
    // is active and let the JS handle easing instead.
    if (el0) {
      el0.style.scrollBehavior = 'auto';
      el0.style.scrollSnapType = 'none';
    }

    const tick = () => {
      const el = ref.current;
      if (!el || isPausedRef.current) return;
      if (el.scrollWidth <= el.clientWidth) return; // nothing to scroll yet

      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      const target = atEnd ? 0 : el.scrollLeft + el.clientWidth * 0.85;
      animateScrollLeft(el, target, Math.min(700, autoScrollMs * 0.8));
    };

    const timer = setInterval(tick, autoScrollMs);
    return () => clearInterval(timer);
  }, [autoScroll, autoScrollMs, ref]);

  const pause = () => {
    isPausedRef.current = true;
  };
  const resume = () => {
    isPausedRef.current = false;
  };

  return (
    <div
      className="scroll-row-wrap"
      onMouseEnter={autoScroll ? pause : undefined}
      onMouseLeave={autoScroll ? resume : undefined}
      onTouchStart={autoScroll ? pause : undefined}
      onTouchEnd={autoScroll ? resume : undefined}
    >
      <button className="scroll-arrow left" aria-label="Scroll left" onClick={() => scroll('left')}>
        ‹
      </button>
      <div className={className} aria-label={ariaLabel} ref={ref}>
        {children}
      </div>
      <button className="scroll-arrow right" aria-label="Scroll right" onClick={() => scroll('right')}>
        ›
      </button>
    </div>
  );
};

// Signature full-width hero: layered organic pastel blobs stand in for
// product photography (no stock gradient rectangle), floating chips,
// dot-navigated slides, autoplay paused on hover.
const HeroBanner = ({ banners, loading, onCtaClick, autoPlayMs = 5500 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = banners.length;

  useEffect(() => {
    if (isPaused || total <= 1) return undefined;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, autoPlayMs);
    return () => clearInterval(timer);
  }, [isPaused, total, autoPlayMs]);

  useEffect(() => {
    setActiveIndex(0);
  }, [total]);

  if (loading) {
    return <div className="hero skeleton" aria-hidden="true" />;
  }
  if (total === 0) return null;

  const goTo = (index) => setActiveIndex(((index % total) + total) % total);
  const goPrev = () => goTo(activeIndex - 1);
  const goNext = () => goTo(activeIndex + 1);
  const banner = banners[activeIndex];

  return (
    <div
      className="hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured promotions"
    >
      <div className="hero-blobs" aria-hidden="true">
        <div className="hero-blob hero-blob-a" style={{ '--from': banner.blobFrom, '--to': banner.blobTo }} />
        <div className="hero-blob hero-blob-b" />
        <div className="hero-blob hero-blob-c" />
      </div>

      <div className="hero-inner">
        <div className="hero-copy">
          {banner.eyebrow && (
            <span className="hero-eyebrow" style={{ '--tint': banner.accentColor }}>
              {banner.eyebrow}
            </span>
          )}
          <h1 className="hero-title">
            {banner.titlePrefix}{' '}
            <span className="hero-title-highlight" style={{ '--tint': banner.accentColor }}>
              {banner.titleHighlight}
            </span>
          </h1>
          <p className="hero-subtitle">{banner.subtitle}</p>
          <div className="hero-actions">
            {banner.ctaText && (
              <button className="btn btn-primary" onClick={() => onCtaClick && onCtaClick(banner.id)}>
                {banner.ctaText}
              </button>
            )}
            {banner.secondaryCtaText && <button className="btn btn-ghost">{banner.secondaryCtaText}</button>}
          </div>
        </div>

        <div className="hero-chips" aria-hidden="true">
          {banner.priceLabel && <div className="hero-chip hero-chip-price">{banner.priceLabel}</div>}
          {banner.ratingLabel && <div className="hero-chip hero-chip-rating">★ {banner.ratingLabel}</div>}
        </div>
      </div>

      {total > 1 && (
        <>
          <button className="hero-arrow hero-arrow-left" aria-label="Previous banner" onClick={goPrev}>
            ‹
          </button>
          <button className="hero-arrow hero-arrow-right" aria-label="Next banner" onClick={goNext}>
            ›
          </button>
          <div className="hero-dots" role="tablist" aria-label="Choose banner">
            {banners.map((b, i) => (
              <button
                key={b.id}
                className={`hero-dot ${i === activeIndex ? 'active' : ''}`}
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Show banner ${i + 1}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Skewed marquee strip directly under the hero — the second half of the
// opening signature, a moving band of promo words instead of a static line.
const MarqueeBand = ({ messages }) => {
  if (!messages || messages.length === 0) return null;
  const track = [...messages, ...messages];
  return (
    <div className="hero-marquee-wrap">
      <div className="hero-marquee">
        <div className="hero-marquee-track">
          {track.map((msg, i) => (
            <span className="hero-marquee-item" key={i}>
              {msg}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const HomeComponent = ({
  categories,
  tickerMessages,
  adBanners,
  campaignBanners,
  topProducts,
  brands,
  wishlist,
  loading,
  onCategoryClick,
  onProductClick,
  onBrandClick,
  onBannerCtaClick,
  onViewAllWishlist,
  onRemoveFromWishlist,
}) => {
  return (
    <div className="home-page">
      {/* Header: logo + wishlist/account/cart/lang */}
      <header className="home-header">
        <div className="home-logo">
          Shoply<span className="logo-dot">.</span>
        </div>
        <div className="home-header-actions">
          <button className="icon-btn" aria-label="Wishlist">
            <span className="icon">♡</span> Wishlist
          </button>
          <button className="icon-btn" aria-label="Account">
            <span className="icon">☺</span> Account
          </button>
          <button className="icon-btn cart-btn" aria-label="Cart">
            <span className="icon">🛍</span> Cart
          </button>
          <select className="lang-select" aria-label="Language" defaultValue="en">
            <option value="en">EN</option>
            <option value="hi">HI</option>
          </select>
        </div>
      </header>

      {/* Category nav: Men, Women, Kids */}
      <nav className="home-nav" aria-label="Primary">
        {categories.map((cat) => (
          <button key={cat} className="nav-link" onClick={() => onCategoryClick(cat)}>
            {cat}
          </button>
        ))}
      </nav>

      {/* Full-width hero + marquee — the opening signature */}
      <HeroBanner banners={adBanners} loading={loading} onCtaClick={onBannerCtaClick} />
      <MarqueeBand messages={tickerMessages} />

      {/* Scrollable campaign banner — autoscrolls continuously, pauses on hover/touch */}
      <section className="home-section">
        <h2 className="section-title">Featured Campaigns</h2>
        <ScrollRow className="scroll-banner campaign-banner" ariaLabel="Campaigns" autoScroll>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="banner-card compact skeleton" />)
            : campaignBanners.map((banner) => (
                <div key={banner.id} className="banner-card compact" style={{ backgroundColor: banner.color }}>
                  <span className="banner-title">{banner.title}</span>
                  <span className="banner-subtitle">{banner.subtitle}</span>
                </div>
              ))}
        </ScrollRow>
      </section>

      {/* Top sales products */}
      <section className="home-section">
        <h2 className="section-title">Top Sales Products</h2>
        <ScrollRow className="product-row" ariaLabel="Top sales products">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="product-card skeleton" />)
            : topProducts.map((product) => (
                <button key={product.id} className="product-card" onClick={() => onProductClick(product.id)}>
                  <div className="product-thumb">
                    {product.tag && <span className="product-tag">{product.tag}</span>}
                    <span className="quick-add">Quick add +</span>
                  </div>
                  <span className="product-name">{product.name}</span>
                  <span className="product-price">₹{product.price}</span>
                </button>
              ))}
        </ScrollRow>
      </section>

      {/* Top brands */}
      <section className="home-section">
        <h2 className="section-title">Top Brands</h2>
        <ScrollRow className="brand-row" ariaLabel="Top brands">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="brand-circle skeleton round" />)
            : brands.map((brand) => (
                <button key={brand.id} className="brand-item" onClick={() => onBrandClick(brand.id)}>
                  <div className="brand-circle">{brand.name.charAt(0)}</div>
                  <span className="brand-name">{brand.name}</span>
                </button>
              ))}
        </ScrollRow>
      </section>

      {/* Wishlist items */}
      <section className="home-section">
        <div className="section-header-row">
          <h2 className="section-title">Wishlist Items</h2>
          <button className="view-all-btn" onClick={onViewAllWishlist}>
            View all
          </button>
        </div>
        <ScrollRow className="product-row" ariaLabel="Wishlist items">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="product-card small skeleton" />)
            : wishlist.map((item) => (
                <div key={item.id} className="product-card small">
                  <div className="product-thumb">
                    
                  </div>
                  <span className="product-name">{item.name}</span>
                  <span className="product-price">₹{item.price}</span>
                </div>
              ))}
        </ScrollRow>
      </section>

      {/* Good format description */}
      <section className="description-block">
        <h3>Why shop with us</h3>
        <div className="perk-grid">
          <div className="perk">
            <span className="perk-icon perk-icon-cobalt">↩</span>
            <div>
              <strong>30-day returns</strong>
              <p>Free returns, no questions asked.</p>
            </div>
          </div>
          <div className="perk">
            <span className="perk-icon perk-icon-coral">🔒</span>
            <div>
              <strong>Secure checkout</strong>
              <p>Your payments are always protected.</p>
            </div>
          </div>
          <div className="perk">
            <span className="perk-icon perk-icon-sun">✓</span>
            <div>
              <strong>Verified brands</strong>
              <p>Only authentic products, every time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-links">
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} Shoply. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomeComponent;