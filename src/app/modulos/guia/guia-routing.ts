import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    redirectTo: 'utilidad/importar',
    pathMatch: 'full',
  },
  {
    path: 'utilidad/importar',
    loadComponent: () => 
        import('./componentes/importar/importar.component').then(
            (m) => m.ImportarComponent
        )
  },
  { path: '', redirectTo: 'utilidad/importar', pathMatch: 'full' },
  { path: '**', redirectTo: 'utilidad/importar', pathMatch: 'full' },
];
