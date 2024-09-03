import { createReducer, on } from '@ngrx/store';
import { getCookie } from 'typescript-cookie';
import { ContenedorActionBorrarInformacion, ContenedorActionInit, ContenedorSeleccionAction } from '../actions/contenedor.actions';

let contenedorDatos: any;
contenedorDatos = getCookie('contenedor');

let estadoInicializado: any = {
    nombre: '',
    imagen: '',
    contenedor_id: 0,
    id: null,
    subdominio: '',
    usuario_id: 0,
    seleccion: false,
    rol: '',
    plan_id: null,
    plan_nombre: null,
    usuarios: 1,
    usuarios_base: 0,
    ciudad: 0,
    correo: '',
    direccion: '',
    identificacion: 0,
    nombre_corto: '',
    numero_identificacion: 0,
    telefono: ''
  };

export const initialState: any = contenedorDatos
  ? JSON.parse(contenedorDatos)
  : estadoInicializado;


export const contenedorReducer = createReducer(
  initialState,
  on(ContenedorActionInit, (state, { contenedor }) => {
    return {
      ...state,
      ...contenedor,
    };
  }),
  on(ContenedorSeleccionAction, (state, { seleccion }) => {
    return {
      ...state,
      seleccion: seleccion,
    };
  }),
  on(ContenedorActionBorrarInformacion, (state) => {
    return {
      ...state,
      ...{
        nombre: '',
        imagen: '',
        contenedor_id: 0,
        id: 0,
        subdominio: '',
        usuario_id: 0,
        seleccion: false,
        rol: '',
        plan_id: 0,
        plan_nombre: null,
        usuarios: 1,
        usuarios_base: 0,
        ciudad: 0,
        correo: '',
        direccion: '',
        identificacion: 0,
        nombre_corto: '',
        numero_identificacion: 0,
        telefono: '',
        acceso_restringido: false
      },
    };
  })
);