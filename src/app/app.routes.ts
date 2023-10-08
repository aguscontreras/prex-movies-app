import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'pre-home',
    loadComponent: () =>
      import('./pages/pre-home/pre-home.page').then((m) => m.PreHomePage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: '',
    redirectTo: 'pre-home',
    pathMatch: 'full',
  },
];
