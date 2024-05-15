import { HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { AlertaService } from '../servicios/alerta.service';
import { catchError } from 'rxjs/operators';

export const errorhttpInterceptor: HttpInterceptorFn = (req, next) => {

  const alerta = inject(AlertaService)  
  return next(req).pipe(
    catchError((error: any) => {
      let errorCodigo: string;
      let errorMensaje: string = '';
      if (error instanceof HttpErrorResponse) {
        switch (error.status) {
          case 401:
            errorMensaje = 'Credenciales invalidas.';
            break;
          default:
            let objError = error.error;
            if (objError.hasOwnProperty('error')) {
              errorCodigo = objError.codigo;
              errorMensaje = objError.error;
            }
            if (objError.hasOwnProperty('mensaje')) {
              errorCodigo = objError.codigo;
              errorMensaje = objError.mensaje;
            }
            if (objError.hasOwnProperty('validaciones')) {
              for (const key in objError.validaciones) {
                errorMensaje += `${key}: ${objError.validaciones[key]}`;
              }
            }

            break;

        }
        alerta.mensajeError(errorMensaje, `Código de error:  ${errorCodigo}`)
      } 
      return throwError(errorMensaje); 
    })
  );
};
