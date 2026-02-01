import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from "./services/auth-service";
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const token = authService.getToken();
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  const isValid = await firstValueFrom(authService.validateToken(token));
  if (!isValid) {
    authService.removeToken();
    router.navigate(['/login']);
    return false;
  }

  return true;
};


