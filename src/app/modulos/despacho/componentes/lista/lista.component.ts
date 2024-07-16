import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import {
  NbButtonModule,
  NbCardModule,
  NbDialogModule,
  NbIconModule,
  NbWindowModule,
  NbWindowRef,
} from "@nebular/theme";
import { BaseFiltroComponent } from "../../../../comun/componentes/base-filtro/base-filtro.component";
import { General } from "../../../../comun/clases/general";
import { DespachoService } from "../../servicios/despacho.service";
import { mapeo } from "../../servicios/mapeo";
import {
  GoogleMapsModule,
} from "@angular/google-maps";

@Component({
  selector: "app-lista",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NbCardModule,
    BaseFiltroComponent,
    NbButtonModule,
    NbIconModule,
    NbDialogModule,
    NbWindowModule,
    GoogleMapsModule,
  ],
  templateUrl: "./lista.component.html",
  styleUrls: ["./lista.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaComponent extends General implements OnInit {

  private windowRef: NbWindowRef | null = null;

  constructor(
    private despachoService: DespachoService,
  ) {
    super();
  }

  selectedFile: File | null = null;
  base64File: string | null = null;
  fileName: string = "";
  arrParametrosConsulta: any = {
    filtros: [],
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 10000,
    modelo: "RutDespacho",
  };
  cantidad_registros!: number;
  arrDespachos: any[];
  encabezados: any[];


  ngOnInit() {
    this.consultaLista();
    this.encabezados = mapeo.datos.filter(
      (titulo) => titulo.visibleTabla === true
    );
  }

  consultaLista() {
    this.despachoService
      .lista(this.arrParametrosConsulta)
      .subscribe((respuesta) => {
        this.arrDespachos = respuesta;
        this.changeDetectorRef.detectChanges();   
      });
  }


  detalleGuia(guia_id: Number) {
    this.router.navigate([`despacho/movimiento/detalle/`, guia_id]);
  }

  editarGuia(guia_id: Number) {
    this.router.navigate([`despacho/movimiento/editar/`, guia_id]);
  }

}
