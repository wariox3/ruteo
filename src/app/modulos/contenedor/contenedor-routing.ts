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
//   {
//     path: '',
//     loadChildren: () =>
//       import('../../pages/dashboard/dashboard.module').then(
//         (m) => m.DashboardModule
//       ),
//   },
  //   import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'lista', pathMatch: 'full' },
];
