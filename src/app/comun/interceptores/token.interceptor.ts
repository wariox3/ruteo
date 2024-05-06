import { HttpContext, HttpContextToken, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../../modulos/auth/servicios/token.service';

  const requiereToken = new HttpContextToken<boolean>(()=> true)
  
  export function checkRequiereToken(){
    return new HttpContext().set(requiereToken, false)
  }

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(TokenService);
  const authToken = authService.obtener()

  const authReq = req.clone({
    setHeaders: {
      'Autorization': `Bearer ${authToken}`
    }
  });

  return next(authReq);
};
