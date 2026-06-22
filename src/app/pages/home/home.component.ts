import { Component, OnInit, AfterViewInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { ProductService } from '../../core/services/product.service';
import { WhatsappService } from '../../core/services/whatsapp.service';
import { Product } from '../../core/models/product.model';
import { APP_CONSTANTS } from '../../core/constants/app.constants';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent, LoadingSpinnerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private productService = inject(ProductService);
  whatsapp = inject(WhatsappService);

  featuredProducts = signal<Product[]>([]);
  isLoading = signal(true);
  animatedStats = signal<number[]>([0, 0, 0, 0]);

  stats = APP_CONSTANTS.STATS;
  features = APP_CONSTANTS.FEATURES;

  // Hero slider
  heroSlides = [
    {
      tag: 'Home Purifier',
      headline: 'Pure Water',
      highlight: 'Every Drop',
      sub: 'Advanced 7-stage RO+UV+UF technology that removes 99.9% of impurities while retaining essential minerals.',
      color: '#2563eb',
      bgFrom: '#0f172a',
      bgTo: '#1e3a8a',
    },
    {
      tag: 'Office Solution',
      headline: 'Smart Water',
      highlight: 'For Your Team',
      sub: 'IoT-enabled office dispensers with hot, cold & normal modes. Monitor filter life from your smartphone.',
      color: '#0891b2',
      bgFrom: '#0f172a',
      bgTo: '#164e63',
    },
    {
      tag: 'Commercial Grade',
      headline: 'Industrial',
      highlight: 'RO Plants',
      sub: 'High-capacity commercial RO plants for restaurants, clinics, factories and housing societies.',
      color: '#7c3aed',
      bgFrom: '#0f172a',
      bgTo: '#1e1b4b',
    },
  ];
  currentSlide = signal(0);
  private slideInterval?: ReturnType<typeof setInterval>;

  purificationStages = [
    { step: '01', name: 'Sediment Filter', desc: 'Removes sand, rust & suspended particles', icon: '🔵', color: '#dbeafe' },
    { step: '02', name: 'Pre-Carbon', desc: 'Eliminates chlorine, odour & bad taste', icon: '⚫', color: '#f1f5f9' },
    { step: '03', name: 'RO Membrane', desc: 'Removes TDS, heavy metals & dissolved salts', icon: '💧', color: '#bfdbfe' },
    { step: '04', name: 'Post-Carbon', desc: 'Final polishing for taste & freshness', icon: '✨', color: '#e0f2fe' },
    { step: '05', name: 'UV Steriliser', desc: 'Kills 99.99% bacteria & viruses', icon: '⚡', color: '#cffafe' },
    { step: '06', name: 'UF Membrane', desc: 'Ultra-filtration removes remaining micro-organisms', icon: '🛡️', color: '#dbeafe' },
    { step: '07', name: 'TDS Controller', desc: 'Retains essential minerals for healthy water', icon: '⚗️', color: '#e0f2fe' },
  ];

  testimonials = [
    { name: 'Priya Raman', role: 'Homemaker, Anna Nagar', text: 'We\'ve been using Annai Aqua Tech for 3 years. Excellent quality and their after-service is outstanding.', rating: 5 },
    { name: 'Karthik Subramaniam', role: 'Restaurant Owner, T.Nagar', text: 'Installed their commercial RO plant last year. Zero maintenance issues and water quality is superb.', rating: 5 },
    { name: 'Dr. Meena Sundaram', role: 'Clinic Director, Adyar', text: 'As a healthcare professional, water purity is non-negotiable. Annai Aqua Tech never disappoints.', rating: 5 },
  ];

  tickerItems = [
    '✦ ISO 9001 Certified',
    '✦ 25,000+ Happy Customers',
    '✦ Free Installation',
    '✦ 1-Year Comprehensive Warranty',
    '✦ Same-Day Service',
    '✦ ISI Approved Products',
    '✦ 50+ Service Areas',
    '✦ 12 Years of Excellence',
  ];

  ngOnInit(): void {
    const products = this.productService.getProducts();
    const featured = products.filter(p => p.isFeatured);
    this.featuredProducts.set(featured.length ? featured : products.slice(0, 4));
    this.isLoading.set(false);
    this.startSlider();
  }

  ngAfterViewInit(): void {
    this.initIntersectionObserver();
  }

  ngOnDestroy(): void {
    if (this.slideInterval) clearInterval(this.slideInterval);
  }

  startSlider(): void {
    this.slideInterval = setInterval(() => {
      this.currentSlide.update(i => (i + 1) % this.heroSlides.length);
    }, 5000);
  }

  goToSlide(i: number): void {
    this.currentSlide.set(i);
    if (this.slideInterval) clearInterval(this.slideInterval);
    this.startSlider();
  }

  private initIntersectionObserver(): void {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.animateCounters();
        observer.disconnect();
      }
    }, { threshold: 0.4 });

    const el = document.querySelector('.stats-section');
    if (el) observer.observe(el);
  }

  private animateCounters(): void {
    this.stats.forEach((stat, idx) => {
      const steps = 80;
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const eased = 1 - Math.pow(1 - progress, 3);
        const updated = [...this.animatedStats()];
        updated[idx] = Math.round(stat.value * eased);
        this.animatedStats.set(updated);
        if (step >= steps) clearInterval(timer);
      }, 2000 / steps);
    });
  }
}
