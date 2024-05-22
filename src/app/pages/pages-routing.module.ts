import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: 'contenedor',
      loadChildren:() => import('../modulos/contenedor/contenedor-routing').then(
        (r) => r.routes
      )
    },
    {
      path: 'administracion/contacto',
      loadChildren:() => import('../modulos/contacto/contacto-routing').then(
        (r) => r.routes
      )
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
