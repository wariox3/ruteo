import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import {
  NbButtonModule,
  NbCardModule,
  NbDialogModule,
  NbIconModule,
  NbWindowModule,
  NbWindowRef,
  NbWindowService,
} from "@nebular/theme";
import { BaseFiltroComponent } from "../../../../comun/componentes/base-filtro/base-filtro.component";
import { General } from "../../../../comun/clases/general";
import { GuiaService } from "../../servicios/guia.service";
import { mapeo } from "../../servicios/mapeo";

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
  ],
  templateUrl: "./lista.component.html",
  styleUrls: ["./lista.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaComponent extends General implements OnInit {
  @ViewChild("contentTemplate") contentTemplate: TemplateRef<any>;
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    private windowService: NbWindowService,
    private guiaService: GuiaService,
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
    modelo: "RutVisita",
  };
  cantidad_registros!: number;
  arrGuia: any[];
  encabezados: any[];

  ngOnInit() {
    this.consultaLista();
    this.encabezados = mapeo.datos.filter(
      (titulo) => titulo.visibleTabla === true
    );
  }

  consultaLista() {
    this.guiaService
      .lista(this.arrParametrosConsulta)
      .subscribe((respuesta) => {
        //this.cantidad_registros = respuesta.cantidad_registros;
        this.arrGuia = respuesta;
        this.changeDetectorRef.detectChanges();
      });
  }

  decodificar() {
    this.guiaService.decodificar().subscribe(() => {
      this.consultaLista()
      this.alerta.mensajaExitoso(
        "Se ha decodificado correctamente",
        "Guardado con éxito."
      );
    });
  }

  detalleGuia(guia_id: Number) {
    this.router.navigate([`visita/movimiento/detalle/`, guia_id]);
  }

  editarGuia(guia_id: Number) {
    this.router.navigate([`visita/movimiento/editar/`, guia_id]);
  }

  openWindow() {
    this.windowService.open(this.contentTemplate, {
      title: "Importar visitas",
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.selectedFile = file;
      this.convertToBase64(file);
    }
  }

  convertToBase64(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      this.base64File = result.split(",")[1];
    };
    reader.onerror = (error) => {
      console.error("Error: ", error);
    };
  }

  uploadFile() {
    if (this.base64File) {
      this.guiaService
        .importarVisitas({ archivo_base64: this.base64File })
        .subscribe((response) => {
          this.consultaLista()
          this.alerta.mensajaExitoso(
            "Se han cargado las guias con éxito",
            "Guardado con éxito."
          );
          this.resetFileInput();
        });
    } else {
      this.alerta.mensajeError("No se ha seleccionado ningún archivo", "Error");
    }
  }

  resetFileInput() {
    this.fileInput.nativeElement.value = '';
    this.fileName = '';
    this.base64File = '';
    this.changeDetectorRef.detectChanges();
  }
}
