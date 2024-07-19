import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { NbButtonModule, NbCardModule, NbIconModule, NbListModule, NbThemeService } from "@nebular/theme";
import { General } from "../../../../comun/clases/general";
import { GoogleMapsModule } from "@angular/google-maps";
import { DespachoService } from "../../../despacho/servicios/despacho.service";
import { GuiaService } from "../../../guia/servicios/guia.service";

@Component({
  selector: "app-trafico",
  standalone: true,
  imports: [CommonModule, NbCardModule, NbButtonModule, NbIconModule, NbListModule, GoogleMapsModule],
  templateUrl: "./trafico.component.html",
  styleUrls: ["./trafico.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TraficoComponent extends General implements OnInit {
  constructor(private despachoService:DespachoService, private themeService: NbThemeService, private visitaService: GuiaService) {
    super();
  }

  despachoSeleccionado: any = null;

  arrParametrosConsulta: any = {
    filtros: [],
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 10000,
    modelo: "RutDespacho",
  };

  arrDespachos:any =[];
  arrVisitasPorDespacho: any = [];

  ngOnInit(): void {
    this.consultaLista();
  }

  consultaLista(){
    this.despachoService.lista(this.arrParametrosConsulta).subscribe((respuesta) => {
      this.arrDespachos = respuesta;
      this.changeDetectorRef.detectChanges();
    });
  }

  seleccionarDespacho(despacho: any) {
    this.despachoSeleccionado = despacho;
    const parametrosConsultaVisitas = {
      filtros: [{ "propiedad": 'despacho_id', "valor1": despacho.id }],
      limite: 50,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: "RutVisita",
    };
    this.visitaService.listarVisitas(parametrosConsultaVisitas).subscribe((respuesta) => {
      this.arrVisitasPorDespacho = respuesta;
      this.changeDetectorRef.detectChanges();
    });
  }

}
