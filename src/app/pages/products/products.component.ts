import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { ProductService } from '../../core/services/product.service';
import { Product, ProductFilter, PaginatedProducts } from '../../core/models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ProductCardComponent, LoadingSpinnerComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);

  isLoading = signal(true);
  result = signal<PaginatedProducts>({
    products: [],
    total: 0,
    page: 1,
    pageSize: 8,
    totalPages: 0,
  });

  filter: ProductFilter = {
    search: '',
    category: 'all',
    sortBy: 'newest',
    page: 1,
    pageSize: 8,
  };

  sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name', label: 'Name: A-Z' },
  ];

  ngOnInit(): void {
    this.applyFilter();
    this.isLoading.set(false);
  }

  applyFilter(): void {
    this.filter.page = 1;
    this.result.set(this.productService.getFilteredProducts(this.filter));
  }

  onSearch(event: Event): void {
    this.filter.search = (event.target as HTMLInputElement).value;
    this.applyFilter();
  }

  onSort(event: Event): void {
    this.filter.sortBy = (event.target as HTMLSelectElement).value as ProductFilter['sortBy'];
    this.applyFilter();
  }

  changePage(page: number): void {
    this.filter.page = page;
    this.result.set(this.productService.getFilteredProducts(this.filter));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get pages(): number[] {
    return Array.from({ length: this.result().totalPages }, (_, i) => i + 1);
  }

  clearSearch(): void {
    this.filter.search = '';
    this.applyFilter();
  }
}
