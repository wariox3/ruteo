import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { NbCardModule } from "@nebular/theme";
import { FormularioComponent } from "../formulario/formulario.component";
import { General } from "../../../../comun/clases/general";

@Component({
  selector: "app-nuevo",
  standalone: true,
  imports: [CommonModule, NbCardModule, FormularioComponent],
  templateUrl: "./nuevo.component.html",
  styleUrls: ["./nuevo.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NuevoComponent extends General implements OnInit {
  informacionContacto: any = {
    numero_identificacion: "",
    digito_verificacion: "",
    nombre_corto: "",
    nombre1: "",
    nombre2: "",
    apellido1: "",
    apellido2: "",
    direccion: "",
    correo: "",
    ciudad: "",
    ciudad_nombre: "",
    identificacion: "",
    telefono: "",
    celular: "",
    tipo_persona: "",
    regimen: "",
    codigo_ciuu: "",
    barrio: "",
    precio: "",
    plazo_pago: "",
    asesor: "",
  };

  ngOnInit() {}

  enviarFormulario(formulario: any) {}
}
