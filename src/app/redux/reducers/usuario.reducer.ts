import { createReducer, on } from "@ngrx/store";
import { usuarioIniciar } from "../actions/usuario.actions";

export const initialState: any = {
  id: "",
  username: "",
  correo: "",
  dominio: "",
  nombre_corto: "",
  nombre: "",
  apellido: "",
  telefono: "",
  idioma: "",
  vr_saldo: 0,
  imagen: "",
  fecha_limite_pago: "",
};

export const usuarioReducer = createReducer(
  initialState,
  on(usuarioIniciar, (state, { usuario }) => {
    console.log(usuario);

    return {
      ...state,
      ...usuario,
    };
  })
);
