import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContenedorService {

  constructor(private http : HttpClient,) { }

  lista(usuario_id: string) {
    return this.http.post<any>(
      `${environment.url_api}/contenedor/usuariocontenedor/consulta-usuario/`,
      {
        usuario_id,
      }
    );
  }

}
