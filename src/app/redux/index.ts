import { UsuarioEffects } from "./efects/usuario.efect";
import { usuarioReducer } from "./reducers/usuario.reducer";

export const StoreApp = {
    usuario: usuarioReducer
};

export const EffectsApp = [
    UsuarioEffects
]