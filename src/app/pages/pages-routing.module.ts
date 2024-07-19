import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { PagesComponent } from "./pages.component";
import { NotFoundComponent } from "./miscellaneous/not-found/not-found.component";

const routes: Routes = [
  {
    path: "",
    component: PagesComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("../modulos/dashboard/dashboard-routing").then(
            (r) => r.routes
          ),
      },
      {
        path: "trafico",
        loadChildren: () =>
          import("../modulos/trafico/trafico-routing").then(
            (r) => r.routes
          ),
      },
      {
        path: "contenedor",
        loadChildren: () =>
          import("../modulos/contenedor/contenedor-routing").then(
            (r) => r.routes
          ),
      },
      {
        path: "administracion/contacto",
        loadChildren: () =>
          import("../modulos/contacto/contacto-routing").then((r) => r.routes),
      },
      {
        path: "administracion/vehiculo",
        loadChildren: () =>
          import("../modulos/vehiculo/vehiculo-routing").then((r) => r.routes),
      },
      {
        path: "administracion/franja",
        loadChildren: () =>
          import("../modulos/franja/franja-routing").then((r) => r.routes),
      },
      {
        path: "visita",
        loadChildren: () =>
          import("../modulos/guia/visita-routing").then((r) => r.routes),
      },
      {
        path: "despacho",
        loadChildren: () =>
          import("../modulos/despacho/despacho-routing").then((r) => r.routes),
      },
      {
        path: "**",
        component: NotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
