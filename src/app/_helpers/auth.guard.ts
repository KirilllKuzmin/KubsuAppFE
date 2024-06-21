import { Injectable, inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn } from '@angular/router';

import { AuthenticationService } from '@app/_services';
import { KeycloakService } from '@app/_services/keycloak/keycloak.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard  {
  constructor(
    private router: Router,
    private authenticationService: KeycloakService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //const user = this.authenticationService.userValue;
    //if (user) {
      // const { roles } = route.data;
      // if (roles && !roles.includes(user.roles[0])) {
        
      //   this.router.navigate(['/']);
      //   return false;
      // }
    if (this.authenticationService.keycloak.isTokenExpired()) {
      this.router.navigate(['login']);
      return false;
    }

    return true;
    //}

    //this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    //return false;
  }
}

// export const authGuard: CanActivateFn = () => {
//   const keycloakService = inject(KeycloakService);
//   const router = inject(Router);
//   if (keycloakService.keycloak.isTokenExpired()) {
//     router.navigate(['login']);
//     return false;
//   }
//   return true;
// };