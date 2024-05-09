import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  NbAuthComponent,
  NbLoginComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';
import { autentificacionGuard } from './comun/guardianes/autentificacion.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo : 'auth/login', pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./modulos/auth/auth.module').then(a => a.NgxAuthModule),
  },
  // {
  //   path: '',
  //   canActivate: [autentificacionGuard],
  //   loadChildren: () => import('./pages/pages.module').then(a => a.PagesModule),
  // },
  { path: '**', redirectTo: 'auth' },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
