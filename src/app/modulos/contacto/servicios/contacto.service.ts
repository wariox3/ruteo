import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpService } from "../../../comun/servicios/http.service";

@Injectable({
  providedIn: "root",
})
export class ContactoService {
  constructor(private http: HttpService) {}

  lista(parametros: any) {
    return this.http.post<any>(
      `general/funcionalidad/lista/`,
      parametros
    );
  }

  listaAutocompletar(modelo:string) {
    return this.http.post<{ cantidad_registros: number; registros: any[] }>(
      "general/funcionalidad/autocompletar/",
      {
        filtros: [
          {
            id: "1692284537644-1688",
            operador: "__icontains",
            propiedad: "nombre__icontains",
            valor1: ``,
            valor2: "",
          },
        ],
        limite: 0,
        desplazar: 0,
        ordenamientos: [],
        limite_conteo: 10000,
        modelo,
      }
    );
  }

  listaCiudades(arrFiltros: any) {
    return this.http.post<any[]>(
      "general/funcionalidad/autocompletar/",
      arrFiltros
    );
  }

  guardarContacto(data: any) {
    return this.http.post<any[]>(`general/contacto/`, data);
  }
}
