import { ContenedorEffects } from "./efects/contenedor.efects";
import { UsuarioEffects } from "./efects/usuario.efect";
import { contenedorReducer } from "./reducers/contenedor.reducer";
import { usuarioReducer } from "./reducers/usuario.reducer";

export const StoreApp = {
    usuario: usuarioReducer,
    contenedor: contenedorReducer
};

export const EffectsApp = [
    UsuarioEffects,
    ContenedorEffects
]