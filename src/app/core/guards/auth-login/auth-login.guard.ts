import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services';

export const authLoginGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isUserLoggedIn) {
    return true;
  }

  return router.parseUrl('/home');
};
