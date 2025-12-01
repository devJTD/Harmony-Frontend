import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const profesorGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);

    if (authService.isProfesor()) {
        console.log('[PROFESOR GUARD] Acceso permitido a ruta de profesor');
        return true;
    }

    console.warn('[PROFESOR GUARD] Acceso denegado. Usuario no es profesor. Redirigiendo según rol.');
    authService.redirectByRole();
    return false;
};
