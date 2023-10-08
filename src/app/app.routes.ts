import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'pre-home',
    loadComponent: () =>
      import('./pre-home/pre-home.page').then((m) => m.PreHomePage),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: '',
    redirectTo: 'pre-home',
    pathMatch: 'full',
  },
];
