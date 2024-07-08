import { Injectable } from "@angular/core";
import { HttpService } from "../../../comun/servicios/http.service";

@Injectable({
  providedIn: "root",
})
export class ImportarService {
  constructor(private http: HttpService) {}

  importarGuias(data: any) {
    return this.http.post<any[]>(`ruteo/guia/importar/`, data);
  }

}
