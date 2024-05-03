import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxLoginComponent } from './componentes/login/login.component'

import { NbAuthComponent } from '@nebular/auth'; 
import { NgxRegistroComponent } from './componentes/registro/registro.component';
export const routes: Routes = [
  {
    path: '',
    component: NbAuthComponent,
    children: [
        {
          path: 'login',
          component: NgxLoginComponent,
        },
          {
          path: 'register',
          component: NgxRegistroComponent,
        },
      ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NgxAuthRoutingModule {
}