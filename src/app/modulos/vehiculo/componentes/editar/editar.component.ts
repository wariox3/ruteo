import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormularioComponent } from '../formulario/formulario.component';
import { vehiculoService } from '../../servicios/vehiculo.service';
import { General } from '../../../../comun/clases/general';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-editar',
  standalone: true,
  imports: [
    CommonModule,
    FormularioComponent
  ],
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditarComponent extends General implements OnInit {
  private vehiculoService = inject(vehiculoService);

  informacionVehiculo: any = {

  };

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      switchMap((respuestaParametros: any)=> {
        return this.vehiculoService.consultarDetalle(respuestaParametros.id)
      }),
      tap((respuestaConsultaDetalle)=>{
        this.informacionVehiculo = respuestaConsultaDetalle
        this.changeDetectorRef.detectChanges();
      })
    ).subscribe();
  }

  enviarFormulario(formulario: any) {
    this.vehiculoService.actualizarDatosVehiculo(this.informacionVehiculo.id, formulario).subscribe((respuesta: any) => {
      this.alerta.mensajaExitoso('Se ha actualizado el vehículo exitosamente.', 'Guardado con éxito.')
      this.router.navigate(['/administracion/vehiculo/detalle', respuesta.id]);
    });
  }

 }
