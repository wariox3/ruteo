import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpService } from '../../../comun/servicios/http.service';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  constructor(
    private http: HttpService,
  ) { }


  lista(parametros: any) {
    return this.http.post<any>(
      `general/funcionalidad/lista-administrador/`,
      parametros
    );
  }

}
