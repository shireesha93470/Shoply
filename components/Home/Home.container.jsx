import React, { useState, useEffect } from 'react';
import HomeComponent from './Home.component';

const MOCK_CATEGORIES = ['Men', 'Women', 'Kids'];

const MOCK_TICKER_MESSAGES = [
  'Free shipping over ₹999',
  'New drops every Friday',
  'Easy 30-day returns',
  'Extra 10% off on the app',
];

const MOCK_AD_BANNERS = [
  {
    id: 1,
    eyebrow: 'New season',
    titlePrefix: 'Back to school,',
    titleHighlight: 'styled right',
    subtitle: 'Be the first to shop A+ looks — backpacks to blazers, all in one drop.',
    ctaText: 'Shop now',
    secondaryCtaText: 'View lookbook',
    priceLabel: 'From ₹799',
    ratingLabel: '4.8 · 12k+ reviews',
    accentColor: '#C9BFFA',
    blobFrom: '#C9BFFA',
    blobTo: '#7C6FE0',
  },
  {
    id: 2,
    eyebrow: 'Limited time',
    titlePrefix: 'Season sale,',
    titleHighlight: 'up to 50% off',
    subtitle: 'Our best styles of the year, marked down while stock lasts.',
    ctaText: 'Shop the sale',
    secondaryCtaText: 'See terms',
    priceLabel: 'Up to 50% off',
    ratingLabel: '4.7 · 9.2k reviews',
    accentColor: '#FFC9B8',
    blobFrom: '#FFC9B8',
    blobTo: '#D9694F',
  },
  {
    id: 3,
    eyebrow: 'Just landed',
    titlePrefix: 'New arrivals,',
    titleHighlight: 'every Friday',
    subtitle: 'Fresh fits dropping weekly — get in before they sell out.',
    ctaText: 'Explore new-in',
    secondaryCtaText: 'Get notified',
    priceLabel: 'New in',
    ratingLabel: '4.9 · 6.4k reviews',
    accentColor: '#B8ECD2',
    blobFrom: '#B8ECD2',
    blobTo: '#2E9A66',
  },
];

const MOCK_CAMPAIGN_BANNERS = [
  { id: 1, title: 'Festive Edit', subtitle: 'Curated looks for the season', color: '#B8ECD2' },
  { id: 2, title: 'Denim Days', subtitle: 'Buy 1 Get 1 on denims', color: '#C9BFFA' },
  { id: 3, title: 'Weekend Drop', subtitle: 'New styles every Friday', color: '#FFC9B8' },
  { id: 4, title: 'Clearance', subtitle: 'Up to 70% off last season', color: '#B8ECD2' },
  { id: 5, title: 'Layer Up', subtitle: 'Jackets & outerwear edit', color: '#C9BFFA' },
  { id: 6, title: 'Sneaker Drop', subtitle: 'Fresh kicks, every month', color: '#FFC9B8' },
  { id: 7, title: 'Office Ready', subtitle: 'Workwear that works', color: '#B8ECD2' },
  { id: 8, title: 'Kids Corner', subtitle: 'Playground-approved fits', color: '#C9BFFA' },
];

const MOCK_TOP_PRODUCTS = [
  { id: 1, name: 'Classic Sneakers', price: 2499, tag: 'Bestseller' },
  { id: 2, name: 'Everyday Hoodie', price: 1899, tag: 'Trending' },
  { id: 3, name: 'Slim Fit Jeans', price: 2199, tag: null },
  { id: 4, name: 'Aviator Sunglasses', price: 999, tag: 'Sale' },
  { id: 5, name: 'Oversized Tee', price: 799, tag: null },
  { id: 6, name: 'Puffer Jacket', price: 3499, tag: 'New' },
  { id: 7, name: 'Cargo Pants', price: 1799, tag: 'Trending' },
  { id: 8, name: 'Canvas Sneakers', price: 1599, tag: null },
  { id: 9, name: 'Wool Beanie', price: 599, tag: 'Sale' },
  { id: 10, name: 'Denim Jacket', price: 2899, tag: null },
  { id: 11, name: 'Chino Shorts', price: 1099, tag: 'New' },
  { id: 12, name: 'Leather Sneakers', price: 3199, tag: 'Bestseller' },
];

const MOCK_BRANDS = [
  { id: 1, name: 'Nova' },
  { id: 2, name: 'Urban Fit' },
  { id: 3, name: 'Stridewear' },
  { id: 4, name: 'Kloth Co.' },
  { id: 5, name: 'Aeris' },
  { id: 6, name: 'Northline' },
  { id: 7, name: 'Vantage' },
  { id: 8, name: 'Drift' },
  { id: 9, name: 'Marrow' },
  { id: 10, name: 'Solace' },
  { id: 11, name: 'Fieldnote' },
  { id: 12, name: 'Haven' },
];

// Added an `image` field for each item — swap these URLs for your real
// product images (CDN / API) whenever they're ready.
const MOCK_WISHLIST = [
  { id: 1, name: 'Linen Shirt', price: 1599, image: 'https://picsum.photos/seed/linen-shirt/400/400' },
  { id: 2, name: 'Running Shoes', price: 3199, image: 'https://picsum.photos/seed/running-shoes/400/400' },
  { id: 3, name: 'Cotton Cap', price: 499, image: 'https://picsum.photos/seed/cotton-cap/400/400' },
  { id: 4, name: 'Leather Belt', price: 899, image: 'https://picsum.photos/seed/leather-belt/400/400' },
  { id: 5, name: 'Canvas Bag', price: 1299, image: 'https://picsum.photos/seed/canvas-bag/400/400' },
  { id: 6, name: 'Wool Scarf', price: 799, image: 'https://picsum.photos/seed/wool-scarf/400/400' },
  { id: 7, name: 'Track Jacket', price: 2199, image: 'https://picsum.photos/seed/track-jacket/400/400' },
  { id: 8, name: 'Formal Shoes', price: 2799, image: 'https://picsum.photos/seed/formal-shoes/400/400' },
  { id: 9, name: 'Graphic Tee', price: 699, image: 'https://picsum.photos/seed/graphic-tee/400/400' },
  { id: 10, name: 'Utility Vest', price: 1899, image: 'https://picsum.photos/seed/utility-vest/400/400' },
];

const HomeContainer = () => {
  const [categories] = useState(MOCK_CATEGORIES);
  const [tickerMessages] = useState(MOCK_TICKER_MESSAGES);
  const [adBanners, setAdBanners] = useState([]);
  const [campaignBanners, setCampaignBanners] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAdBanners(MOCK_AD_BANNERS);
      setCampaignBanners(MOCK_CAMPAIGN_BANNERS);
      setTopProducts(MOCK_TOP_PRODUCTS);
      setBrands(MOCK_BRANDS);
      setWishlist(MOCK_WISHLIST);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleCategoryClick = (category) => {
    console.log('Navigate to category:', category);
  };

  const handleProductClick = (productId) => {
    console.log('Navigate to product:', productId);
  };

  const handleBrandClick = (brandId) => {
    console.log('Navigate to brand:', brandId);
  };

  const handleBannerCtaClick = (bannerId) => {
    console.log('Navigate from banner CTA:', bannerId);
  };

  const handleViewAllWishlist = () => {
    console.log('Navigate to wishlist page');
  };

  return (
    <HomeComponent
      categories={categories}
      tickerMessages={tickerMessages}
      adBanners={adBanners}
      campaignBanners={campaignBanners}
      topProducts={topProducts}
      brands={brands}
      wishlist={wishlist}
      loading={loading}
      onCategoryClick={handleCategoryClick}
      onProductClick={handleProductClick}
      onBrandClick={handleBrandClick}
      onBannerCtaClick={handleBannerCtaClick}
      onViewAllWishlist={handleViewAllWishlist}
      heroAutoPlayMs={3000}
    />
  );
};

export default HomeContainer;