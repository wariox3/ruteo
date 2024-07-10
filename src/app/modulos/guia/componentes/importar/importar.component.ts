import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { NbButtonModule, NbCardModule, NbIconModule } from "@nebular/theme";
import { General } from "../../../../comun/clases/general";
import { GuiaService } from "../../servicios/guia.service";

@Component({
  selector: "app-importar",
  standalone: true,
  imports: [CommonModule, NbCardModule, NbButtonModule, NbIconModule],
  templateUrl: "./importar.component.html",
  styleUrls: ["./importar.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportarComponent extends General {
  constructor(private importarService: GuiaService) {
    super();
  }

  selectedFile: File | null = null;
  base64File: string | null = null;
  fileName: string = '';

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
      this.importarService
        .importarVisitas({ archivo_base64: this.base64File })
        .subscribe((response) => {
          this.alerta.mensajaExitoso(
            "Se han cargado las guias con éxito",
            "Guardado con éxito."
          );
        });
    } else {
      this.alerta.mensajeError("No se ha seleccionado ningún archivo", "Error");
    }
  }
}
