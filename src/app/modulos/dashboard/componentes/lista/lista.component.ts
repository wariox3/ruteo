import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { NbButtonModule, NbCardModule, NbIconModule } from "@nebular/theme";
import { General } from "../../../../comun/clases/general";
import { vehiculoService } from "../../../vehiculo/servicios/vehiculo.service";
import { GuiaService } from "../../../guia/servicios/guia.service";
import { forkJoin } from "rxjs";
import { tap } from "rxjs/operators";

@Component({
  selector: "app-lista",
  standalone: true,
  imports: [CommonModule, NbCardModule, NbButtonModule, NbIconModule],
  templateUrl: "./lista.component.html",
  styleUrls: ["./lista.component.css"],
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

  arrParametrosConsultaVisita: any = {
    filtros: [
      {"propiedad": "decodificado", "valor1": true},
      {"propiedad": "decodificado_error", "valor1": false},
    ],
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 10000,
    modelo: "RutVisita",
  };

  arrVehiculos: any[] = [];
  arrVisitas: any[];

  constructor(
    private vehiculoService: vehiculoService,
    private visitaService: GuiaService,
  ) {
    super();
  }

  ngOnInit(): void {
    forkJoin({
      vehiculos: this.vehiculoService.lista(this.arrParametrosConsulta),
      visitas: this.visitaService.lista(this.arrParametrosConsultaVisita) 
    }).pipe(
      tap(({ vehiculos, visitas }) => {
        this.arrVehiculos = vehiculos.registros;
        this.arrVisitas = visitas;
        this.changeDetectorRef.detectChanges();
      })
    ).subscribe();    
  }
}

