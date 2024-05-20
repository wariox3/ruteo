import { createReducer, on } from "@ngrx/store";
import { usuarioIniciar } from "../actions/usuario.actions";
import { getCookie } from "typescript-cookie";

let usuarioData:any = getCookie('usuario');

let parsedState:any =  {
  id: '',
  username: '',
  cargo: '',
  imagen: '',
  nombre_corto: '',
  nombre: '',
  apellido: '',
  telefono: '',
  correo: '',
  idioma: '',
  dominio: '',
  fecha_limite_pago: new Date(),
  vr_saldo: 0
};

export const initialState: any = usuarioData ? JSON.parse(usuarioData): parsedState;

export const usuarioReducer = createReducer(
  initialState,
  on(usuarioIniciar, (state, { usuario }) => {
    return {
      ...state,
      ...usuario,
    };
  })
);
