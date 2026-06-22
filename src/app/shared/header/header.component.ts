import { Component, OnInit, OnDestroy, inject, signal, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ThemeService } from '../../core/services/theme.service';
import { WhatsappService } from '../../core/services/whatsapp.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  themeService = inject(ThemeService);
  whatsappService = inject(WhatsappService);
  authService = inject(AuthService);
  private router = inject(Router);

  isMenuOpen = signal(false);
  isScrolled = signal(true);  // solid by default; home route at top may go transparent

  navLinks: { label: string; path: string; exact: boolean }[] = [
    { label: 'Home',       path: '/',        exact: true  },
    { label: 'Products',   path: '/products', exact: false },
    { label: 'Contact Us', path: '/contact',  exact: false },
    { label: 'Login',      path: '/login',    exact: false },
  ];

  private routerSub?: Subscription;
  private isHomePage = false;

  ngOnInit(): void {
    this.routerSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.isHomePage = e.urlAfterRedirects === '/';
        this.updateScrollState();
      });

    // Set initial state based on current URL
    this.isHomePage = this.router.url === '/';
    this.updateScrollState();
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.updateScrollState();
  }

  private updateScrollState(): void {
    // Transparent only on home page when scrolled to very top
    if (this.isHomePage && window.scrollY < 10) {
      this.isScrolled.set(false);
    } else {
      this.isScrolled.set(true);
    }
  }

  toggleMenu(): void { this.isMenuOpen.update((v) => !v); }
  closeMenu(): void { this.isMenuOpen.set(false); }
}
