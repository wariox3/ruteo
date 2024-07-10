import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NbButtonModule, NbCardModule, NbIconModule } from '@nebular/theme';
import { GuiaService } from '../../servicios/guia.service';
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
  protected guiaService = inject(GuiaService);
  vehiculo = {
      "id": null,
      "guia": null,
      "fecha": null,
      "documento": null,
      "destinatario": null,
      "destinatario_direccion": null,
      "destinatario_telefono": null,
      "destinatario_correo": null,
      "peso": null,
      "volumen": null,
      "decodificado": true,
      "latitud": null,
      "longitud": null
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      switchMap((respuestaParametros: any)=> {
        return this.guiaService.consultarDetalle(respuestaParametros.id)
      }),
      tap((respuestaConsultaDetalle)=>{
        this.vehiculo = respuestaConsultaDetalle
        this.changeDetectorRef.detectChanges();
      })
    ).subscribe();
  }


}
