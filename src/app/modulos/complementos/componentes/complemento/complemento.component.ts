import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbListModule,
} from "@nebular/theme";
import { General } from "../../../../comun/clases/general";
import { GoogleMapsModule, MapDirectionsService } from "@angular/google-maps";
import { DespachoService } from "../../../despacho/servicios/despacho.service";
import { GuiaService } from "../../../guia/servicios/guia.service";
import { ComplementoService } from "../../servicios/complemento.service";

@Component({
  selector: "app-complemento",
  standalone: true,
  imports: [
    CommonModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbListModule,
    GoogleMapsModule,
  ],
  templateUrl: "./complemento.component.html",
  styleUrls: ["./complemento.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TraficoComponent extends General implements OnInit {
  constructor(
    private complementoService: ComplementoService
  ) {
    super();
  }

  arrComplementos: any

  ngOnInit(): void {
    this.consultaLista();
  }

  consultaLista(){
    this.complementoService.listarComplementos().subscribe((respuesta) => {
      this.arrComplementos = respuesta
      this.changeDetectorRef.detectChanges();
    })
  }

  instalar(complemento: any) {
    const complementoModificado = { ...complemento, instalado: true };
    this.complementoService.instalarComplemento(complementoModificado.id, complementoModificado)
      .subscribe((respuesta) => {
        this.consultaLista();
        this.changeDetectorRef.detectChanges();
      });
  }
}
