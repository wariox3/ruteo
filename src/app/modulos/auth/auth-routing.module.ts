import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NgxLoginComponent } from "./componentes/login/login.component";

import { NbAuthComponent } from "@nebular/auth";
import { NgxRegistroComponent } from "./componentes/registro/registro.component";
import { RecuperarComponent } from "./componentes/recuperar/recuperar.component";
export const routes: Routes = [
  {
    path: "",
    component: NbAuthComponent,
    children: [
      {
        path: "login",
        component: NgxLoginComponent,
      },
      {
        path: "register",
        component: NgxRegistroComponent,
      },
      {
        path: "reset-password",
        component:  RecuperarComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NgxAuthRoutingModule {}
