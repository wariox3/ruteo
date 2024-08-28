import { Store } from "@ngrx/store";
import { environment } from "../../../environments/environment";
import { obtenerContenedorSubdominio } from "../../redux/selectos/contenedor.selectors";
import { inject } from '@angular/core';

export class Subdomino {

  private store = inject(Store);

  urlSubDominio: string;

  constructor() {
    this.store.select(obtenerContenedorSubdominio).subscribe((respuesta) => {
      this.urlSubDominio = environment.url_api_subdominio;
      this.urlSubDominio = this.urlSubDominio.replace("subdominio", respuesta);
    }); 
  }
}
