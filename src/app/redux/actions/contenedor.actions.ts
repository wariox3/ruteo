import { createAction, props } from '@ngrx/store';

export const ContenedorActionInit = createAction(
  '[Contenedor] informacion',
  props<{contenedor: any}>()
);

export const ContenedorGuardarAction = createAction(
  '[Contenedor] Guardar contenedor en localstore',
  props<{contenedor: any}>()
);

export const ContenedorSeleccionAction = createAction(
  '[Contenedor] Seleccionar contenedor',
  props<{ seleccion: boolean }>()
);

export const ContenedorActionBorrarInformacion = createAction(
  '[Contenedor] borrar informacion'
);
