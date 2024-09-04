import { Usuario } from '@/interfaces/usuario/usuario.interface';
import { createAction, props } from '@ngrx/store';

export const usuarioIniciar = createAction(
    '[Usuario] informacion',
    props<{usuario: Usuario}>()
);