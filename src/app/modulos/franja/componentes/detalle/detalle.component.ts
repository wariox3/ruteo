import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NbButtonModule, NbCardModule, NbIconModule } from '@nebular/theme';
import { franjaService } from '../../servicios/vehiculo.service';
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
  protected franjaService = inject(franjaService)

  franja: any = {
    nombre: '',
    coordenadas: {

    }
  }

ngOnInit(): void {
  this.activatedRoute.params.pipe(
    switchMap((respuestaParametros: any)=> {
      return this.franjaService.consultarDetalle(respuestaParametros.id)
    }),
    tap((respuestaConsultaDetalle)=>{
      this.franja = respuestaConsultaDetalle
      this.changeDetectorRef.detectChanges();
    })
  ).subscribe();
}

}
