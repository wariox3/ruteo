import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { tap } from "rxjs/operators";
import { setCookie } from "typescript-cookie";
import { ContenedorActionInit } from "../actions/contenedor.actions";

@Injectable()
export class ContenedorEffects {
  guardarConenedor$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ContenedorActionInit),
        tap((action:any) => {
          let calcularTresHoras = new Date(
            new Date().getTime() + 3 * 60 * 60 * 1000
          );
          setCookie(
            'contenedor',
            JSON.stringify(action.contenedor),
            {
              expires: calcularTresHoras,
              path: "/",
            }
          );
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions) {}
}
