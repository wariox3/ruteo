export const mapeo: any = {
  modulo: "general",
  modelo: "despacho",
  tipo: "Movimiento",
  datos: [
    {
      nombre: "ID",
      campoTipo: "IntegerField",
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: "Vehículo",
      campoTipo: "IntegerField",
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
    },
    {
      nombre: "Peso",
      campoTipo: "CharField",
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    },
    {
      nombre: "Volumen",
      campoTipo: "CharField",
      visibleTabla: true,
      visibleFiltro: false,
      ordenable: false,
    },
    {
      nombre: "Visitas",
      campoTipo: "CharField",
      visibleTabla: true,
      visibleFiltro: true,
      ordenable: true,
    }
  ],
};
