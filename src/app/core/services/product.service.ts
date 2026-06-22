import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Product, ProductFilter, PaginatedProducts } from '../models/product.model';
import { APP_CONSTANTS } from '../constants/app.constants';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private readonly STORAGE_KEY = APP_CONSTANTS.LOCAL_STORAGE_KEYS.PRODUCTS;

  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  loadProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('assets/data/products.json').pipe(
      tap((jsonProducts) => {
        const localProducts = this.getLocalProducts();
        const merged = this.mergeProducts(jsonProducts, localProducts);
        this.productsSubject.next(merged);
      }),
      map(() => this.productsSubject.getValue())
    );
  }

  private mergeProducts(jsonProducts: Product[], localProducts: Product[]): Product[] {
    const localIds = new Set(localProducts.map((p) => p.id));
    const filtered = jsonProducts.filter((p) => !localIds.has(p.id));
    return [...filtered, ...localProducts].sort((a, b) => a.id - b.id);
  }

  getProducts(): Product[] {
    return this.productsSubject.getValue();
  }

  getProductById(id: number): Product | undefined {
    return this.productsSubject.getValue().find((p) => p.id === id);
  }

  getFeaturedProducts(count = 4): Product[] {
    const products = this.productsSubject.getValue();
    return products.filter((p) => p.isFeatured).slice(0, count) || products.slice(0, count);
  }

  getFilteredProducts(filter: ProductFilter): PaginatedProducts {
    let products = this.productsSubject.getValue();

    if (filter.search) {
      const term = filter.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.capacity.toLowerCase().includes(term)
      );
    }

    if (filter.category && filter.category !== 'all') {
      products = products.filter((p) => p.category === filter.category);
    }

    switch (filter.sortBy) {
      case 'price-asc':
        products = [...products].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products = [...products].sort((a, b) => b.price - a.price);
        break;
      case 'name':
        products = [...products].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        products = [...products].sort((a, b) => b.id - a.id);
        break;
    }

    const total = products.length;
    const totalPages = Math.ceil(total / filter.pageSize);
    const start = (filter.page - 1) * filter.pageSize;
    const paginated = products.slice(start, start + filter.pageSize);

    return { products: paginated, total, page: filter.page, pageSize: filter.pageSize, totalPages };
  }

  addProduct(product: Omit<Product, 'id'>): void {
    const all = this.productsSubject.getValue();
    const maxId = all.length > 0 ? Math.max(...all.map((p) => p.id)) : 0;
    const newProduct: Product = { ...product, id: maxId + 1 };
    const local = this.getLocalProducts();
    local.push(newProduct);
    this.saveLocalProducts(local);
    this.productsSubject.next([...all, newProduct]);
  }

  updateProduct(product: Product): void {
    const local = this.getLocalProducts();
    const idx = local.findIndex((p) => p.id === product.id);
    if (idx >= 0) {
      local[idx] = product;
    } else {
      local.push(product);
    }
    this.saveLocalProducts(local);
    const updated = this.productsSubject.getValue().map((p) => (p.id === product.id ? product : p));
    this.productsSubject.next(updated);
  }

  deleteProduct(id: number): void {
    const local = this.getLocalProducts().filter((p) => p.id !== id);
    this.saveLocalProducts(local);
    const updated = this.productsSubject.getValue().filter((p) => p.id !== id);
    this.productsSubject.next(updated);
  }

  getRelatedProducts(productId: number, count = 4): Product[] {
    return this.productsSubject
      .getValue()
      .filter((p) => p.id !== productId)
      .slice(0, count);
  }

  private getLocalProducts(): Product[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveLocalProducts(products: Product[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
  }
}
