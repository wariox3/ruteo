import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbCardModule } from '@nebular/theme';
import { vehiculoService } from '../../servicios/vehiculo.service';

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [
    CommonModule,
    NbCardModule,
  ],
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetalleComponent implements OnInit {

  protected activatedRoute = inject(ActivatedRoute);
  protected vehiculoService: vehiculoService

  vehiculo: any = {
    placa: '',
    capacidad: 0
  }

ngOnInit(): void {
  this.activatedRoute.queryParams.subscribe(
    (parametros) => {
      console.log(parametros);

      // this.vehiculoService.consultarDetalle

    }
  );
}

}
