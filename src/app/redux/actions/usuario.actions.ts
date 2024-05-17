import { createAction, props } from '@ngrx/store';

export const usuarioIniciar = createAction(
    '[Usuario] informacion',
    props<{usuario: any}>()
);