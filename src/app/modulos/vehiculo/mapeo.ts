export const mapeo: any = {
  modulo: "general",
  modelo: "vehiculo",
  tipo: "Administrador",
  datos: [
    {
      nombre: "ID",
      campoTipo: "IntegerField",
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: "Placa",
      campoTipo: "CharField",
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
    },
    {
      nombre: "Capacidad",
      campoTipo: "CharField",
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    }
  ],
};
