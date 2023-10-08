import { Routes } from '@angular/router';
import { authLoginGuard } from './core';

export const routes: Routes = [
  {
    path: 'pre-home',
    loadComponent: () =>
      import('./pages/pre-home/pre-home.page').then((m) => m.PreHomePage),
    canActivate: [authLoginGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
    canActivate: [authLoginGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then((m) => m.RegisterPage),
    canActivate: [authLoginGuard],
  },
  {
    path: '',
    redirectTo: 'pre-home',
    pathMatch: 'full',
  },
];
