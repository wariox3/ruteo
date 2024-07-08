import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { NbButtonModule, NbCardModule, NbIconModule } from "@nebular/theme";
import { BaseFiltroComponent } from "../../../../comun/componentes/base-filtro/base-filtro.component";
import { General } from "../../../../comun/clases/general";
import { vehiculoService } from "../../servicios/vehiculo.service";
import { mapeo } from "../../mapeo";

@Component({
  selector: "app-lista",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NbCardModule,
    BaseFiltroComponent,
    NbButtonModule,
    NbIconModule
  ],
  templateUrl: "./lista.component.html",
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
    modelo: "RutVehiculo",
  };
  cantidad_registros!: number;
  arrVehiculos: any[];
  encabezados: any[];

  private vehiculoService = inject(vehiculoService);

  ngOnInit() {
    this.consultaLista();
    this.encabezados = mapeo.datos.filter((titulo) => titulo.visibleTabla === true)
  }

  consultaLista() {
    this.vehiculoService
      .lista(this.arrParametrosConsulta)
      .subscribe((respuesta) => {
        this.cantidad_registros = respuesta.cantidad_registros;
        this.arrVehiculos = respuesta.registros;
        this.changeDetectorRef.detectChanges();
      });
  }

  detalleVehiculo(vehiculo_id: Number) {    
    this.router.navigate([`/administracion/vehiculo/detalle/`, vehiculo_id]);
  }

  editarVehiculo(vehiculo_id: Number){
    this.router.navigate([`/administracion/vehiculo/editar/`, vehiculo_id]);
  }
}
