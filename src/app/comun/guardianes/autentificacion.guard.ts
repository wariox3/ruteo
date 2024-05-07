import { inject } from '@angular/core';
import { Router, type CanMatchFn } from '@angular/router';
import { TokenService } from '../../modulos/auth/servicios/token.service';

export const autentificacionGuard: CanMatchFn = (route, segments) => {

  const tokenValido = inject(TokenService).validarToken();

  const router = inject(Router);

  if (tokenValido) {
    return true;
  }

  //redirect a la landing page
  router.navigate(['']);
  return false;

};
