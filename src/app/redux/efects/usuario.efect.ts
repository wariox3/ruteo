import { Injectable, inject } from "@angular/core";
import { createEffect, Actions, ofType } from "@ngrx/effects";
import { usuarioIniciar } from "../actions/usuario.actions";
import { tap } from "rxjs/operators";
import { setCookie } from "typescript-cookie";

@Injectable()
export class UsuarioEffects {

  private actions$ = inject(Actions);

  guardarUsuario$ = createEffect(() =>
    this.actions$.pipe(
      ofType(usuarioIniciar),
      tap((action) => {
        let calcularTiempo = new Date(
            new Date().getTime() + 3 * 60 * 60 * 1000
          );
          setCookie('usuario', JSON.stringify(action.usuario), {
            expires: calcularTiempo,
            path: '/'
          })
      })
    ),
    { dispatch: false }
  );
}
