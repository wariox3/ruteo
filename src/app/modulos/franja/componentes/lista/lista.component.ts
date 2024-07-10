import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Inject, OnInit, inject } from "@angular/core";
import { NbButtonModule, NbCardModule, NbIconModule } from "@nebular/theme";
import { BaseFiltroComponent } from "../../../../comun/componentes/base-filtro/base-filtro.component";
import { TablaComponent } from "../../../../comun/componentes/tabla/tabla.component";
import { General } from "../../../../comun/clases/general";
import { RouterModule } from "@angular/router";
import { KeysPipe } from "../../../../comun/pipe/keys.pipe";
import { franjaService } from "../../servicios/vehiculo.service";
import { mapeo } from "../../mapeo";

@Component({
  selector: "app-lista",
  standalone: true,
  imports: [CommonModule, NbCardModule, BaseFiltroComponent, TablaComponent, RouterModule, NbButtonModule, KeysPipe, NbIconModule],
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
    modelo: 'RutFranja'
  };
  cantidad_registros!: number;
  arrItems: any[];
  encabezados: any[];

  private franjaService = inject(franjaService);

  ngOnInit(){
    this.consultarLista();    
    this.encabezados = mapeo.datos.filter((titulo) => titulo.visibleTabla === true)
  }

  consultarLista(){
    this.franjaService.lista(this.arrParametrosConsulta).subscribe((respuesta)=> {
      this.cantidad_registros = respuesta.cantidad_registros;
      this.arrItems = respuesta.registros;
      this.changeDetectorRef.detectChanges();
    })
  }

  detalleEmpresa(franja_id: Number) {
    this.router.navigate([`/administracion/franja/detalle/${franja_id}`]);
  }

  editarVehiculo(franja_id: Number){
    this.router.navigate([`/administracion/franja/editar/`, franja_id]);
  }
}
