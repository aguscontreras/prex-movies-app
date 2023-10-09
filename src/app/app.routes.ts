import { Routes } from '@angular/router';
import { authGuard, authLoginGuard } from './core';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'pre-home',
    pathMatch: 'full',
  },
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
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
    canActivate: [authGuard],
  },
];
