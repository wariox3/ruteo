import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NbButtonModule, NbCardModule, NbIconModule } from '@nebular/theme';
import { vehiculoService } from '../../servicios/vehiculo.service';
import { switchMap, tap } from 'rxjs/operators';
import { General } from '../../../../comun/clases/general';

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [
    CommonModule,
    NbCardModule,
    RouterModule,
    NbIconModule,
    NbButtonModule
  ],
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetalleComponent extends General implements OnInit {

  protected activatedRoute = inject(ActivatedRoute);
  protected vehiculoService = inject(vehiculoService)

  vehiculo: any = {
    placa: '',
    capacidad: 0
  }

ngOnInit(): void {
  this.activatedRoute.params.pipe(
    switchMap((respuestaParametros: any)=> {
      return this.vehiculoService.consultarDetalle(respuestaParametros.id)
    }),
    tap((respuestaConsultaDetalle)=>{
      this.vehiculo = respuestaConsultaDetalle
      this.changeDetectorRef.detectChanges();
    })
  ).subscribe();
}

}
