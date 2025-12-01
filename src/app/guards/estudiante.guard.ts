import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const estudianteGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);

    if (authService.isCliente()) {
        console.log('[ESTUDIANTE GUARD] Acceso permitido a ruta de estudiante');
        return true;
    }

    console.warn('[ESTUDIANTE GUARD] Acceso denegado. Usuario no es estudiante. Redirigiendo según rol.');
    authService.redirectByRole();
    return false;
};
