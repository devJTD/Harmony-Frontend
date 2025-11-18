import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

/**
 * Interceptor HTTP para agregar el token JWT a todas las peticiones.
 * Si el token es inválido (401), redirige al login.
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  // Lista de URLs que no requieren autenticación
  const publicUrls = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/talleres/activos',
    '/api/talleres/detallados/activos',
    '/api/profesores',
    '/api/inscripcion/talleresDisponibles',
    '/api/inscripcion/cliente',
    '/api/inscripcion/confirmar',
    '/contacto/enviar'
  ];

  // Verificar si la URL actual es pública
  const isPublicUrl = publicUrls.some(url => req.url.includes(url));

  // Si hay token y no es una URL pública, agregar el header Authorization
  if (token && !isPublicUrl) {
    console.log('[JWT INTERCEPTOR] Agregando token a la petición:', req.url);
    
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Continuar con la petición y manejar errores
  return next(req).pipe(
    catchError(error => {
      // Si es error 401 (No autorizado), cerrar sesión y redirigir
      if (error.status === 401 && !isPublicUrl) {
        console.error('[JWT INTERCEPTOR] Error 401 - Token inválido o expirado');
        console.error('[JWT INTERCEPTOR] Cerrando sesión y redirigiendo a login');
        
        authService.logout();
        router.navigate(['/auth/login'], {
          queryParams: { returnUrl: router.url }
        });
      }

      // Si es error 403 (Prohibido), el usuario no tiene permisos
      if (error.status === 403) {
        console.error('[JWT INTERCEPTOR] Error 403 - Sin permisos para esta acción');
        router.navigate(['/']);
      }

      return throwError(() => error);
    })
  );
};