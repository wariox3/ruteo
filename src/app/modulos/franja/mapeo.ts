export const mapeo: any = {
  modulo: "general",
  modelo: "franca",
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
      nombre: "Nombre",
      campoTipo: "CharField",
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
    },
    {
      nombre: "Coordenadas",
      campoTipo: "CharField",
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    }
  ],
};
