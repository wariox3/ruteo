import { Route } from "@angular/router";

export const routes: Route[] = [
  {
    path: "movimiento/lista",
    loadComponent: () =>
      import("./componentes/lista/lista.component").then(
        (m) => m.ListaComponent
      ),
  },
  {
    path: "movimiento/nuevo",
    loadComponent: () =>
      import("./componentes/nuevo/nuevo.component").then(
        (m) => m.NuevoComponent
      ),
  },
  {
    path: "movimiento/editar/:id",
    loadComponent: () =>
      import("./componentes/editar/editar.component").then(
        (m) => m.EditarComponent
      ),
  },
  {
    path: "movimiento/detalle/:id",
    loadComponent: () =>
      import("./componentes/detalle/detalle.component").then(
        (m) => m.DetalleComponent
      ),
  },
  {
    path: "utilidad/importar",
    loadComponent: () =>
      import("./componentes/importar/importar.component").then(
        (m) => m.ImportarComponent
      ),
  },
  {
    path: "utilidad/rutear",
    loadComponent: () =>
      import("./componentes/rutear/rutear.component").then(
        (m) => m.RutearComponent
      ),
  },
];
