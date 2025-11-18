import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth-service';

/**
 * Guard para proteger rutas que requieren autenticación.
 * Verifica si el usuario está autenticado y opcionalmente si tiene el rol requerido.
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('[AUTH GUARD] Verificando acceso a:', state.url);

  // Verificar si el usuario está autenticado
  if (!authService.isAuthenticated()) {
    console.log('[AUTH GUARD] Usuario no autenticado, redirigiendo a login');
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  // Verificar roles si la ruta los requiere
  const requiredRoles = route.data['roles'] as string[];
  
  if (requiredRoles && requiredRoles.length > 0) {
    const userRole = authService.getUserRole();
    console.log('[AUTH GUARD] Rol del usuario:', userRole);
    console.log('[AUTH GUARD] Roles requeridos:', requiredRoles);

    if (!userRole || !requiredRoles.includes(userRole)) {
      console.log('[AUTH GUARD] Usuario sin permisos suficientes');
      router.navigate(['/']);
      return false;
    }
  }

  console.log('[AUTH GUARD] Acceso permitido');
  return true;
};

/**
 * Guard para proteger rutas del panel de administración.
 * Solo permite acceso a usuarios con rol ROLE_ADMIN.
 */
export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('[ADMIN GUARD] Verificando acceso de administrador a:', state.url);

  if (!authService.isAuthenticated()) {
    console.log('[ADMIN GUARD] Usuario no autenticado');
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  if (!authService.isAdmin()) {
    console.log('[ADMIN GUARD] Usuario no es administrador');
    router.navigate(['/']);
    return false;
  }

  console.log('[ADMIN GUARD] Acceso de administrador permitido');
  return true;
};

/**
 * Guard para proteger rutas de clientes.
 * Solo permite acceso a usuarios con rol ROLE_CLIENTE.
 */
export const clienteGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('[CLIENTE GUARD] Verificando acceso de cliente a:', state.url);

  if (!authService.isAuthenticated()) {
    console.log('[CLIENTE GUARD] Usuario no autenticado');
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  if (!authService.isCliente()) {
    console.log('[CLIENTE GUARD] Usuario no es cliente');
    router.navigate(['/']);
    return false;
  }

  console.log('[CLIENTE GUARD] Acceso de cliente permitido');
  return true;
};

/**
 * Guard para proteger rutas de profesores.
 * Solo permite acceso a usuarios con rol ROLE_PROFESOR.
 */
export const profesorGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('[PROFESOR GUARD] Verificando acceso de profesor a:', state.url);

  if (!authService.isAuthenticated()) {
    console.log('[PROFESOR GUARD] Usuario no autenticado');
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  if (!authService.isProfesor()) {
    console.log('[PROFESOR GUARD] Usuario no es profesor');
    router.navigate(['/']);
    return false;
  }

  console.log('[PROFESOR GUARD] Acceso de profesor permitido');
  return true;
};