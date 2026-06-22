export const APP_CONSTANTS = {
  WHATSAPP_NUMBER: '919786178889',
  COMPANY_NAME: 'Annai Aqua Tech',
  TAGLINE: 'Pure Water. Healthy Life.',
  ADMIN_USERNAME: 'admin',
  ADMIN_PASSWORD: 'admin123',
  LOCAL_STORAGE_KEYS: {
    PRODUCTS: 'annai_products',
    AUTH: 'annai_auth',
    THEME: 'annai_theme',
    LANGUAGE: 'annai_language',
  },
  CONTACT_INFO: {
    address: '45, Anna Nagar, Chennai, Tamil Nadu — 600 040',
    phone: '+91 99999 99999',
    email: 'info@annaiaquatech.com',
    hours: 'Mon – Sat: 9:00 AM – 7:00 PM',
  },
  STATS: [
    { value: 25000, label: 'Happy Customers', suffix: '+', icon: 'users' },
    { value: 15000, label: 'Purifiers Installed', suffix: '+', icon: 'package' },
    { value: 50, label: 'Service Areas', suffix: '+', icon: 'map-pin' },
    { value: 12, label: 'Years Experience', suffix: '+', icon: 'award' },
  ],
  FEATURES: [
    {
      icon: 'shield',
      title: '7-Stage Purification',
      description: 'Multi-stage RO + UV + UF technology removes 99.9% of contaminants',
      color: 'blue',
    },
    {
      icon: 'droplets',
      title: 'Mineral Retention',
      description: 'TDS controller preserves essential minerals for healthy drinking',
      color: 'cyan',
    },
    {
      icon: 'zap',
      title: 'Smart Alerts',
      description: 'Real-time filter life monitoring and auto-flush technology',
      color: 'navy',
    },
    {
      icon: 'truck',
      title: 'Free Installation',
      description: 'Expert installation and same-day service across all service areas',
      color: 'blue',
    },
  ],
} as const;

export const NAV_LABELS = {
  home: 'Home',
  products: 'Products',
  contact: 'Contact Us',
  login: 'Login',
  enquireNow: 'Get Free Demo',
};

export const PRODUCT_PAGE_LABELS = {
  title: 'Our Products',
  search: 'Search purifiers...',
  sortBy: 'Sort By',
  filterBy: 'Filter By',
  viewDetails: 'View Details',
  enquireNow: 'Get Free Demo',
  noProducts: 'No products found',
};

export const FOOTER_LABELS = {
  about: 'Premium water purification solutions for a healthier India.',
  quickLinks: 'Quick Links',
  contact: 'Contact Us',
  followUs: 'Follow Us',
  copyright: `© ${new Date().getFullYear()} Annai Aqua Tech. All rights reserved.`,
};
