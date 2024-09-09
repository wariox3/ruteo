import { Injectable } from "@angular/core";
import { HttpService } from "../../../comun/servicios/http.service";
import { Visita } from "@/interfaces/visita/visita.interface";

@Injectable({
  providedIn: "root",
})
export class GuiaService {
  constructor(private http: HttpService) {}

  lista(data: any) {
    return this.http.post<Visita[]>(`ruteo/visita/lista/`, data);
  }

  listarVisitas(data: any) {
    return this.http.post<any[]>(`ruteo/visita/lista/`, data);
  }

  guardarGuias(data: any) {
    return this.http.post<any[]>(`ruteo/visita/`, data);
  }

  consultarDetalle(id: number) {
    return this.http.getDetalle<any>(`ruteo/visita/${id}/`);
  }

  importarVisitas(data: any) {
    return this.http.post<any[]>(`ruteo/visita/importar/`, data);
  }

  decodificar() {
    return this.http.post<any[]>(`ruteo/visita/decodificar/`, "");
  }

  ordenar() {
    return this.http.post<any[]>(`ruteo/visita/ordenar/`, "");
  }

  rutear() {
    return this.http.post<any[]>(`ruteo/visita/rutear/`, "");
  }

  eliminarGuia(id: number) {
    return this.http.delete(`ruteo/visita/${id}/`, {});
  }

  eliminarTodosLasGuias() {
    return this.http.post('ruteo/visita/eliminar-todos/', {});
  }

  importarComplementos(registros: number) {
    return this.http.post(`ruteo/visita/importar-complemento/`, {
      limite: registros,
    });
  }
}
