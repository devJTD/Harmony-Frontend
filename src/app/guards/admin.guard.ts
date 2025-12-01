import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  if (authService.isAdmin()) {
    console.log('[ADMIN GUARD] Acceso permitido a ruta de admin');
    return true;
  }

  console.warn('[ADMIN GUARD] Acceso denegado. Usuario no es admin. Redirigiendo según rol.');
  authService.redirectByRole();
  return false;
};
