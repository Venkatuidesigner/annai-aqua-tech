import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  private productService = inject(ProductService);
  authService = inject(AuthService);

  products = signal<Product[]>([]);
  deleteConfirmId = signal<number | null>(null);
  searchTerm = signal('');

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.products.set(this.productService.getProducts());
  }

  get filteredProducts(): Product[] {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.products();
    return this.products().filter((p) =>
      p.name.toLowerCase().includes(term) || p.capacity.toLowerCase().includes(term)
    );
  }

  confirmDelete(id: number): void {
    this.deleteConfirmId.set(id);
  }

  cancelDelete(): void {
    this.deleteConfirmId.set(null);
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id);
    this.deleteConfirmId.set(null);
    this.loadProducts();
  }

  onSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  logout(): void {
    this.authService.logout();
  }

  get totalProducts(): number { return this.products().length; }
  get totalVariants(): number { return this.products().reduce((sum, p) => sum + p.variants.length, 0); }
}
