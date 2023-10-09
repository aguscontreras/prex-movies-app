import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services';

export const authGuard = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const tokens = await authService.retrieveTokensFromStorage();

  if (tokens) {
    return true;
  }

  return router.parseUrl('/login');
};
