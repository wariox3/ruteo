import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { PagesComponent } from "./pages.component";
import { NotFoundComponent } from "./miscellaneous/not-found/not-found.component";
import { contenedorGuard } from "../comun/guardianes/contenedor.guard";

const routes: Routes = [
  {
    path: "",
    component: PagesComponent,
    children: [
      {
        path: "",
        canActivateChild: [contenedorGuard],
        loadChildren: () =>
          import("../modulos/dashboard/dashboard-routing").then(
            (r) => r.routes
          ),
      },
      {
        path: "trafico",
        canActivateChild: [contenedorGuard],
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
        canActivateChild: [contenedorGuard],
        loadChildren: () =>
          import("../modulos/contacto/contacto-routing").then((r) => r.routes),
      },
      {
        path: "administracion/vehiculo",
        canActivateChild: [contenedorGuard],
        loadChildren: () =>
          import("../modulos/vehiculo/vehiculo-routing").then((r) => r.routes),
      },
      {
        path: "administracion/franja",
        canActivateChild: [contenedorGuard],
        loadChildren: () =>
          import("../modulos/franja/franja-routing").then((r) => r.routes),
      },
      {
        path: "visita",
        canActivateChild: [contenedorGuard],
        loadChildren: () =>
          import("../modulos/guia/visita-routing").then((r) => r.routes),
      },
      {
        path: "despacho",
        canActivateChild: [contenedorGuard],
        loadChildren: () =>
          import("../modulos/despacho/despacho-routing").then((r) => r.routes),
      },
      {
        path: "complemento",
        canActivateChild: [contenedorGuard],
        loadChildren: () =>
          import("../modulos/complementos/complemento-routing").then(
            (r) => r.routes
          ),
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
