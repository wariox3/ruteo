import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    redirectTo: 'lista',
    pathMatch: 'full',
  },
  {
    path: 'lista',
    loadComponent: () => 
        import('./componentes/lista/lista.component').then(
            (m) => m.ListaComponent
        )
  },
  {
    path: 'nuevo',
    loadComponent: () => 
        import('./componentes/nuevo/nuevo.component').then(
            (m) => m.NuevoComponent
        )
  },
  {
    path: ':contenedorNombre/:contenedorCodigo/invitacion/nuevo',
    loadComponent: () =>
      import('./componentes/invitacion/invitacion.component').then(
        (m) => m.InvitacionComponent
      )
  },
  {
    path: 'detalle/:contenedorCodigo',
    loadComponent: () =>
      import('./componentes/detalle/detalle.component').then(
        (m) => m.DetalleComponent
      )
  },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'lista', pathMatch: 'full' },
];
