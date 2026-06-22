import { Component, Input, signal, computed, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-product-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-gallery.component.html',
  styleUrl: './product-gallery.component.scss',
  animations: [
    trigger('fadeImage', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' })),
      ]),
    ]),
  ],
})
export class ProductGalleryComponent implements OnChanges {
  @Input({ required: true }) images: string[] = [];
  @Input() productName = '';

  activeIndex = signal(0);
  lightboxOpen = signal(false);
  imageError = signal<boolean[]>([]);
  isZoomed = signal(false);

  ngOnChanges(): void {
    this.activeIndex.set(0);
    this.imageError.set(new Array(this.images.length).fill(false));
  }

  get activeImage(): string {
    if (this.imageError()[this.activeIndex()]) {
      return this.getFallback();
    }
    return this.images[this.activeIndex()] ?? this.getFallback();
  }

  selectImage(index: number): void {
    this.activeIndex.set(index);
  }

  openLightbox(): void {
    this.lightboxOpen.set(true);
  }

  closeLightbox(): void {
    this.lightboxOpen.set(false);
  }

  nextImage(): void {
    this.activeIndex.update((i) => (i + 1) % this.images.length);
  }

  prevImage(): void {
    this.activeIndex.update((i) => (i - 1 + this.images.length) % this.images.length);
  }

  onImageError(index: number): void {
    const errors = [...this.imageError()];
    errors[index] = true;
    this.imageError.set(errors);
  }

  toggleZoom(): void {
    this.isZoomed.update((v) => !v);
  }

  getFallback(): string {
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
        <rect width="400" height="400" fill="#eff6ff"/>
        <rect x="160" y="80" width="80" height="200" rx="20" fill="#2563eb" opacity="0.7"/>
        <rect x="170" y="60" width="60" height="30" rx="10" fill="#1d4ed8" opacity="0.6"/>
        <text x="200" y="330" text-anchor="middle" font-family="Arial" font-size="14" fill="#64748b">Annai Aqua Tech</text>
      </svg>
    `)}`;
  }
}
