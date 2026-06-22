import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { APP_CONSTANTS, FOOTER_LABELS } from '../../core/constants/app.constants';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  contact = APP_CONSTANTS.CONTACT_INFO;
  labels = FOOTER_LABELS;
  currentYear = new Date().getFullYear();

  socialLinks = [
    { name: 'Facebook', icon: 'facebook', url: '#' },
    { name: 'Instagram', icon: 'instagram', url: '#' },
    { name: 'YouTube', icon: 'youtube', url: '#' },
    { name: 'LinkedIn', icon: 'linkedin', url: '#' },
  ];

  quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'Admin Login', path: '/login' },
  ];

  productLinks = [
    { label: 'RO Purifiers', path: '/products' },
    { label: 'UV Purifiers', path: '/products' },
    { label: 'Under-Counter Systems', path: '/products' },
    { label: 'Commercial RO Plants', path: '/products' },
    { label: 'Office Dispensers', path: '/products' },
  ];
}
