import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { GoogleMapsModule } from "@angular/google-maps";
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbListModule,
  NbWindowRef,
  NbWindowService,
} from "@nebular/theme";
import { General } from "../../../../comun/clases/general";
import { RespuestaComplemento } from "../../../../interfaces/complemento/complemento.interface";
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
    NbInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./complemento.component.html",
  styleUrls: ["./complemento.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TraficoComponent extends General implements OnInit {
  @ViewChild("contentTemplate") contentTemplate: TemplateRef<any>;
  formularioDinamico: FormGroup;
  formularios: FormGroup[] = [];
  formControls: any[] = [];
  windowRef: NbWindowRef;

  constructor(
    private complementoService: ComplementoService,
    private windowService: NbWindowService
  ) {
    super();
  }

  arrComplementos: RespuestaComplemento[];

  ngOnInit(): void {
    this.consultaLista();
  }

  openWindow(indexFormulario: number, nombreFormulario: string) {
    this.windowRef = this.windowService.open(this.contentTemplate, {
      title: `Configurar ${nombreFormulario}`,
      context: {
        indexFormulario,
      },
    });
  }

  crearFormulario() {
    this.arrComplementos.forEach((complemento) => {
      const formGroup = new FormGroup({
        id: new FormControl(complemento.id),
        nombre: new FormControl(complemento.nombre),
        estructura_json: new FormControl(complemento.estructura_json),
        datos_json: new FormArray([]),
      });

      const datosJSON = formGroup.get("datos_json") as FormArray;

      if (Array.isArray(complemento?.datos_json) || complemento?.datos_json === null) {
        complemento.estructura_json?.forEach((estructuraDatos) => {
          const campo = complemento?.datos_json?.filter(
            (campoDatos) => campoDatos.nombre === estructuraDatos.nombre
          );
          const valor = campo?.[0]?.valor || "";
          datosJSON.push(
            new FormGroup({
              nombre: new FormControl(estructuraDatos.nombre),
              valor: new FormControl(
                valor,
                Validators.compose([Validators.required])
              ),
            })
          );
        });
      } else {
        console.error("datos_json debe ser de tipo Array");
      }

      this.formularios.push(formGroup);
    });

    this.changeDetectorRef.detectChanges();
  }

  guardarInformacion(indexFormulario: string) {
    if (this.formularios[indexFormulario].valid) {
      const id = this.formularios[indexFormulario].get("id")?.value;
      this.complementoService
        .actualizarComplemento(id, this.formularios[indexFormulario].value)
        .subscribe(() => {
          this.consultaLista();
          this.alerta.mensajaExitoso(
            "Se actualizó correctamente el complemento.",
            "Guardado con éxito."
          );
          this.windowRef.close();
          this.changeDetectorRef.detectChanges();
        });
    }
  }

  consultaLista() {
    this.complementoService.listarComplementos().subscribe((respuesta) => {
      this.arrComplementos = respuesta;
      this.crearFormulario();
      this.changeDetectorRef.detectChanges();
    });
  }

  instalar(complemento: any) {
    const complementoModificado = { ...complemento, instalado: true };
    this.complementoService
      .instalarComplemento(complementoModificado.id, complementoModificado)
      .subscribe((respuesta) => {
        this.consultaLista();
        this.changeDetectorRef.detectChanges();
      });
  }
}
