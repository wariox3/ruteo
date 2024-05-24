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
      `general/funcionalidad/lista-administrador/`,
      parametros
    );
  }

  listaAutocompletar(modelo:string) {
    return this.http.post<{ cantidad_registros: number; registros: any[] }>(
      "general/funcionalidad/lista-autocompletar/",
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
      "general/funcionalidad/lista-autocompletar/",
      arrFiltros
    );
  }
}
