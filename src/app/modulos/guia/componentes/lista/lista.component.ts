import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NbButtonModule, NbCardModule, NbIconModule } from '@nebular/theme';
import { BaseFiltroComponent } from '../../../../comun/componentes/base-filtro/base-filtro.component';
import { General } from '../../../../comun/clases/general';
import { GuiaService } from '../../servicios/guia.service';
import { mapeo } from '../../servicios/mapeo';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NbCardModule,
    BaseFiltroComponent,
    NbButtonModule,
    NbIconModule
  ],
  templateUrl: './lista.component.html',
  styleUrls: ["./lista.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaComponent extends General implements OnInit {

  arrParametrosConsulta: any = {
    filtros: [],
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 10000,
    modelo: "RutGuia",
  };
  cantidad_registros!: number;
  arrGuia: any[];
  encabezados: any[];
  private guiaService = inject(GuiaService);

  ngOnInit() {
    this.consultaLista();
    this.encabezados = mapeo.datos.filter((titulo) => titulo.visibleTabla === true)
  }

  consultaLista() {
    this.guiaService
      .lista(this.arrParametrosConsulta)
      .subscribe((respuesta) => {
        //this.cantidad_registros = respuesta.cantidad_registros;
        this.arrGuia = respuesta;
        this.changeDetectorRef.detectChanges();
      });
  }

  detalleVehiculo(vehiculo_id: Number) {
    this.router.navigate([`guia/administracion/detalle/`, vehiculo_id]);
  }

  editarVehiculo(vehiculo_id: Number){
    this.router.navigate([`guia/administracion/editar/`, vehiculo_id]);
  }

}
