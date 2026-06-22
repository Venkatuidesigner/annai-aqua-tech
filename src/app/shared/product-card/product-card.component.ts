import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { Product, ProductVariant } from '../../core/models/product.model';
import { WhatsappService } from '../../core/services/whatsapp.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  animations: [
    trigger('imgFade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.96)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ],
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  whatsapp = inject(WhatsappService);

  selectedIndex = signal(0);
  imageError = signal(false);
  isHovered = signal(false);

  get variant(): ProductVariant {
    return this.product.variants[this.selectedIndex()];
  }

  get mainImage(): string {
    return this.variant?.images?.[0] ?? this.fallbackSvg(this.variant?.colorCode ?? '#2563eb');
  }

  get hoverImage(): string {
    return this.variant?.images?.[1] ?? this.mainImage;
  }

  selectVariant(i: number, e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    if (i !== this.selectedIndex()) {
      this.imageError.set(false);
      this.selectedIndex.set(i);
    }
  }

  onEnquire(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    this.whatsapp.openEnquiry(this.product, this.variant);
  }

  onImgError(): void { this.imageError.set(true); }

  fallbackSvg(color: string): string {
    const c = encodeURIComponent(color);
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="360" viewBox="0 0 300 360">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f0f9ff"/>
            <stop offset="100%" style="stop-color:#e0f2fe"/>
          </linearGradient>
          <linearGradient id="body" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:${color};stop-opacity:0.85"/>
            <stop offset="100%" style="stop-color:${color}"/>
          </linearGradient>
        </defs>
        <rect width="300" height="360" fill="url(#bg)"/>
        <!-- Purifier body -->
        <rect x="105" y="60" width="90" height="220" rx="22" fill="url(#body)"/>
        <!-- Cap top -->
        <rect x="120" y="42" width="60" height="26" rx="10" fill="${color}" opacity="0.7"/>
        <!-- Display panel -->
        <rect x="118" y="100" width="64" height="48" rx="8" fill="rgba(255,255,255,0.2)"/>
        <!-- LED indicators -->
        <circle cx="132" cy="116" r="4" fill="#34d399"/>
        <circle cx="150" cy="116" r="4" fill="rgba(255,255,255,0.4)"/>
        <circle cx="168" cy="116" r="4" fill="rgba(255,255,255,0.4)"/>
        <!-- Brand label -->
        <rect x="118" y="172" width="64" height="72" rx="6" fill="rgba(255,255,255,0.92)"/>
        <text x="150" y="196" text-anchor="middle" font-family="Arial" font-size="8" font-weight="800" fill="#1e40af">ANNAI</text>
        <text x="150" y="208" text-anchor="middle" font-family="Arial" font-size="6" fill="#0891b2">AQUA TECH</text>
        <line x1="122" y1="214" x2="178" y2="214" stroke="#e2e8f0" stroke-width="0.8"/>
        <text x="150" y="226" text-anchor="middle" font-family="Arial" font-size="5.5" fill="#64748b">RO+UV+UF</text>
        <text x="150" y="236" text-anchor="middle" font-family="Arial" font-size="5" fill="#94a3b8">PURIFIER</text>
        <!-- Tap -->
        <rect x="143" y="270" width="14" height="18" rx="4" fill="${color}" opacity="0.6"/>
        <rect x="136" y="282" width="28" height="6" rx="3" fill="${color}" opacity="0.5"/>
        <!-- Shine -->
        <path d="M115,80 Q118,140 115,240" stroke="rgba(255,255,255,0.35)" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path d="M119,65 Q121,80 120,95" stroke="rgba(255,255,255,0.55)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <!-- Shadow -->
        <ellipse cx="150" cy="295" rx="50" ry="10" fill="rgba(0,0,0,0.1)"/>
        <text x="150" y="330" text-anchor="middle" font-family="Arial" font-size="11" fill="#94a3b8">Annai Aqua Tech</text>
      </svg>
    `)}`;
  }
}
