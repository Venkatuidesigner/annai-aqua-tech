import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/products/products.component').then((m) => m.ProductsComponent),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./pages/product-details/product-details.component').then(
        (m) => m.ProductDetailsComponent
      ),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/admin-dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent
      ),
  },
  {
    path: 'admin/add-product',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/add-product/add-product.component').then(
        (m) => m.AddProductComponent
      ),
  },
  {
    path: 'admin/edit-product/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/add-product/add-product.component').then(
        (m) => m.AddProductComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
