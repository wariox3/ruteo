import { Vehiculo } from "@/interfaces/vehiculo/vehiculo.interface";
import { Visita } from "@/interfaces/visita/visita.interface";
import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { NbButtonModule, NbCardModule, NbIconModule } from "@nebular/theme";
import { forkJoin } from "rxjs";
import { tap } from "rxjs/operators";
import { General } from "../../../../comun/clases/general";
import { GuiaService } from "../../../guia/servicios/guia.service";
import { vehiculoService } from "../../../vehiculo/servicios/vehiculo.service";

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
    filtros: [{ propiedad: "estado_decodificado", valor1: true }],
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 10000,
    modelo: "RutVisita",
  };

  arrVehiculos: Vehiculo[] = [];
  arrVisitas: Visita[];

  constructor(
    private vehiculoService: vehiculoService,
    private visitaService: GuiaService
  ) {
    super();
  }

  ngOnInit(): void {
    forkJoin({
      vehiculos: this.vehiculoService.lista(this.arrParametrosConsulta),
      visitas: this.visitaService.lista(this.arrParametrosConsultaVisita),
    })
      .pipe(
        tap(({ vehiculos, visitas }) => {
          this.arrVehiculos = vehiculos.registros;
          this.arrVisitas = visitas;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }
}
