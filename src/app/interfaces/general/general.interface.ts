export interface GeneralLista<T> {
  cantidad_registros: number;
  registros: T[];
}

export interface ParametrosConsulta {
    filtros: object[],
    limite: number;
    desplazar: number;
    ordenamientos: object[],
    limite_conteo: number;
    modelo: string;
}