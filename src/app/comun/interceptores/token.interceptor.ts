import { HttpContext, HttpContextToken,type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../../modulos/auth/servicios/token.service';

  const requiereToken = new HttpContextToken<boolean>(()=> true)
  
  export function noRequiereToken(){
    return new HttpContext().set(requiereToken, false)
  }


export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(TokenService);
  if (request.context.get(requiereToken)) {
    //validar vigencia
    const tokenValido = authService.validarToken();
    if (tokenValido) {
      return adicionarToken(request, next);
    } else {
      // return this.actualizarTokenPorVencimiento(request, next);
    }
  }

  return next(request);
};

const adicionarToken = (request: any, next: any) => {
  const authService = inject(TokenService);
  if (request.context.get(requiereToken)) {
    const token = authService.obtener();
    if (token) {
      const authReq = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`),
      });
      return next.handle(authReq);
    }
  }
  return next.handle(request);
}
