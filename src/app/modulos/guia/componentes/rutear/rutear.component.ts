import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { NbButtonModule, NbCardModule, NbIconModule } from "@nebular/theme";
import { General } from "../../../../comun/clases/general";
import { GuiaService } from "../../servicios/guia.service";
import { mapeo } from "../../servicios/mapeo";

@Component({
  selector: "app-rutear",
  standalone: true,
  imports: [CommonModule, NbCardModule, NbButtonModule, NbIconModule],
  templateUrl: "./rutear.component.html",
  styleUrls: ["./rutear.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RutearComponent extends General implements OnInit {
  constructor(private vistaService: GuiaService) {
    super();
  }

  arrParametrosConsulta: any = {
    filtros: [
      {"propiedad":"estado_despacho","valor1": false},
      {"propiedad": "decodificado", "valor1": true},
      {"propiedad": "decodificado_error", "valor1": false},
    ],
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 10000,
    modelo: "RutVisita",
  };

  arrVisitas:any = [];
  encabezados: any[];

  ngOnInit(): void {
    this.consultaLista()
    this.encabezados = mapeo.datos.filter(
      (titulo) => titulo.visibleTabla === true
    );
    this.changeDetectorRef.detectChanges();
  }

  consultaLista() {
    this.vistaService
      .lista(this.arrParametrosConsulta)
      .subscribe((respuesta) => {
        this.arrVisitas = respuesta;
        this.changeDetectorRef.detectChanges();
      });
  }

  rutear(){
    this.vistaService.rutear().subscribe(() => {
      this.consultaLista();
      this.alerta.mensajaExitoso(
        "Se ha ruteado correctamente correctamente",
        "Guardado con éxito."
      );
    });
  }

  ordenar(){
    
  }
}
