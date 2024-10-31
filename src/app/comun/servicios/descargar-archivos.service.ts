import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class DescargarArchivosService {
  constructor() {}

  descargarArchivoLocal(fileUrl: string, nombreArchivo: string) {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = nombreArchivo;
    // Añadir el enlace al DOM y hacer clic en él para iniciar la descarga
    document.body.appendChild(link);
    link.click();
    // Eliminar el enlace del DOM
    document.body.removeChild(link);
  }
}
