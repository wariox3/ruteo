import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { General } from '../../../../comun/clases/general';
import { FormularioComponent } from '../formulario/formulario.component';
import { NbCardModule } from '@nebular/theme';

@Component({
  selector: 'app-nuevo',
  standalone: true,
  imports: [
    CommonModule,
    FormularioComponent,
    NbCardModule,
  ],
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NuevoComponent extends General {

  procesando = false;

  informacionContenedor: any = {
    nombre: '',
    subdominio: '',
    plan_id: 0,
    imagen: null,
    ciudad: '',
    correo: '',
    direccion: '',
    identificacion: '',
    nombre_corto: '',
    numero_identificacion: '',
    telefono: '',
    ciudad_nombre: '',
    digito_verificacion: '',
  };

  enviarFormulario(dataFormularioLogin: any){

  }

 }
