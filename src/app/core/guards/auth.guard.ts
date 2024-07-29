import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { inject } from '@angular/core';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log("authguard isAuth: ", authService.getIsAuthenticated())
  if(!authService.getIsAuthenticated()) {
    router.navigate(['/login']);
    return false;
  } 
  return true;

};
