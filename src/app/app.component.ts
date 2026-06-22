import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { WhatsappButtonComponent } from './shared/whatsapp-button/whatsapp-button.component';
import { ScrollToTopComponent } from './shared/scroll-to-top/scroll-to-top.component';
import { ThemeService } from './core/services/theme.service';
import { ProductService } from './core/services/product.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    WhatsappButtonComponent,
    ScrollToTopComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private themeService = inject(ThemeService);
  private productService = inject(ProductService);

  ngOnInit(): void {
    this.productService.loadProducts().subscribe();
  }
}
