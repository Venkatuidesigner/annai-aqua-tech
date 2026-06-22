import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductGalleryComponent } from '../../shared/product-gallery/product-gallery.component';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { ProductService } from '../../core/services/product.service';
import { WhatsappService } from '../../core/services/whatsapp.service';
import { Product, ProductVariant } from '../../core/models/product.model';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductGalleryComponent, ProductCardComponent, LoadingSpinnerComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  whatsapp = inject(WhatsappService);

  product = signal<Product | null>(null);
  relatedProducts = signal<Product[]>([]);
  selectedVariantIndex = signal(0);
  isLoading = signal(true);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      const p = this.productService.getProductById(id);
      this.product.set(p ?? null);
      if (p) {
        this.relatedProducts.set(this.productService.getRelatedProducts(id, 4));
      }
      this.selectedVariantIndex.set(0);
      this.isLoading.set(false);
    });
  }

  get selectedVariant(): ProductVariant | null {
    const p = this.product();
    if (!p) return null;
    return p.variants[this.selectedVariantIndex()];
  }

  get currentImages(): string[] {
    return this.selectedVariant?.images ?? [];
  }

  selectVariant(index: number): void {
    this.selectedVariantIndex.set(index);
  }

  onEnquire(): void {
    const p = this.product();
    const v = this.selectedVariant;
    if (p && v) {
      this.whatsapp.openEnquiry(p, v);
    }
  }
}
