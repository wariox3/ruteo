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
    path: "utilidad/importar",
    loadComponent: () =>
      import("./componentes/importar/importar.component").then(
        (m) => m.ImportarComponent
      ),
  },
];
