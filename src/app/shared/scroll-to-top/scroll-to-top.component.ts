import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scroll-to-top.component.html',
  styleUrl: './scroll-to-top.component.scss',
})
export class ScrollToTopComponent {
  isVisible = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.isVisible.set(window.scrollY > 300);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
