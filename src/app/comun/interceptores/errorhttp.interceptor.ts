import { HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { AlertaService } from '../servicios/alerta.service';
import { catchError } from 'rxjs/operators';

export const errorhttpInterceptor: HttpInterceptorFn = (req, next) => {

  const alerta = inject(AlertaService)  
  return next(req).pipe(
    catchError((error: any) => {
      let errorMensaje: string = '';
      if (error instanceof HttpErrorResponse) {

        switch (error.status) {
          case 400:
            errorMensaje = 'El usuario ya existe.';
            break;
          case 401:
            errorMensaje = 'Credenciales invalidas.';
            break;
        }
        alerta.mensajeError(errorMensaje, `Error ${error.status}`);
      } 
      return throwError(errorMensaje); 
    })
  );
};
