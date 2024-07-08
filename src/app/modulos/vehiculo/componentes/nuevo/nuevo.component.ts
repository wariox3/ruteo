import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormularioComponent } from '../formulario/formulario.component';
import { vehiculoService } from '../../servicios/vehiculo.service';
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
  private vehiculoService = inject(vehiculoService);

  informacionVehiculo: any = {
    placa: "",
    capacidad: "",

  };

  ngOnInit() {}

  enviarFormulario(formulario: any) {
    this.vehiculoService.guardarVehiculo(formulario).subscribe((respuesta: any) => {
      this.alerta.mensajaExitoso('Se ha creado el vehículo exitosamente.', 'Guardado con éxito.')
      this.router.navigate(['/administracion/vehiculo/detalle', respuesta.id]);
    });
  }

 }
