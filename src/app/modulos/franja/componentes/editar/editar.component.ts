import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormularioComponent } from '../formulario/formulario.component';
import { franjaService } from '../../servicios/vehiculo.service';
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
  private franjaService = inject(franjaService);

  informacionFranja: any = {

  };

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      switchMap((respuestaParametros: any)=> {
        return this.franjaService.consultarDetalle(respuestaParametros.id)
      }),
      tap((respuestaConsultaDetalle)=>{
        this.informacionFranja = respuestaConsultaDetalle
        this.changeDetectorRef.detectChanges();
      })
    ).subscribe();
  }

  enviarFormulario(formulario: any) {
    this.franjaService.actualizarDatosVehiculo(this.informacionFranja.id, formulario).subscribe((respuesta: any) => {
      this.alerta.mensajaExitoso('Se ha actualizado la franja con exitosamente.', 'Guardado con éxito.')
      this.router.navigate(['/administracion/franja/detalle', respuesta.id]);
    });
  }

 }
