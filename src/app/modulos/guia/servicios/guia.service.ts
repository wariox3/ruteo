import { Injectable } from "@angular/core";
import { HttpService } from "../../../comun/servicios/http.service";

@Injectable({
  providedIn: "root",
})
export class GuiaService {
  constructor(private http: HttpService) {}

  lista(parametros: any) {
    return this.http.get<any>(
      `ruteo/visita/`,
    );
  }

  guardarGuias(data: any){
    return this.http.post<any[]>(`ruteo/visita/`, data);
  }

  consultarDetalle(id: number) {
    return this.http.getDetalle<any>(`ruteo/visita/${id}/`);
  }

  importarVisitas(data: any) {
    return this.http.post<any[]>(`ruteo/visita/importar/`, data);
  }

}
