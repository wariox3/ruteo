import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormularioComponent } from '../formulario/formulario.component';
import { franjaService } from '../../servicios/vehiculo.service';
import { General } from '../../../../comun/clases/general';

@Component({
  selector: 'app-nuevo',
  standalone: true,
  imports: [
    CommonModule,
    FormularioComponent
  ],
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NuevoComponent extends General implements OnInit {
  private franjaService = inject(franjaService);

  informacionFranja: any = {
    nombre: "",
    coordenadas: {

    },

  };

  ngOnInit() {}

  enviarFormulario(formulario: any) {
    this.franjaService.guardarFranja(formulario).subscribe((respuesta: any) => {
      this.alerta.mensajaExitoso('Se ha creado franja exitosamente.', 'Guardado con éxito.')
      this.router.navigate(['/administracion/franja/detalle', respuesta.id]);
    });
  }

 }
