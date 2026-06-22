export interface ProductVariant {
  colorName: string;
  colorCode: string;
  images: string[];
}

export interface Product {
  id: number;
  name: string;
  price: number;
  capacity: string;
  storage?: string;
  description: string;
  features: string[];
  variants: ProductVariant[];
  category?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface ProductFilter {
  search: string;
  category: string;
  sortBy: 'name' | 'price-asc' | 'price-desc' | 'newest';
  page: number;
  pageSize: number;
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
