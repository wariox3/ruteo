import { Injectable } from "@angular/core";
import { HttpService } from "../../../comun/servicios/http.service";

@Injectable({
  providedIn: "root",
})
export class DespachoService {
  constructor(private http: HttpService) {}

  lista(parametros: any) {
    return this.http.get<any>(
      `ruteo/despacho/`,
    );
  }

  guardarGuias(data: any){
    return this.http.post<any[]>(`ruteo/despacho/`, data);
  }

  consultarDetalle(id: number) {
    return this.http.getDetalle<any>(`ruteo/despacho/${id}/`);
  }

  importarVisitas(data: any) {
    return this.http.post<any[]>(`ruteo/despacho/importar/`, data);
  }

  decodificar(){
    return this.http.post<any[]>(`ruteo/despacho/decodificar/`, '');
  }

  ordenar(){
    return this.http.post<any[]>(`ruteo/despacho/ordenar/`, '');
  }

}
