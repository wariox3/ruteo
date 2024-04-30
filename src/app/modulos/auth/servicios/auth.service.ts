import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { checkRequiereToken } from '../../../interceptores/token.interceptor';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http : HttpClient) { }

  registro(parametros:any){
    return this.http.post<any>(`${environment.url_api}api/usuario/registro`, parametros, {context: checkRequiereToken()})
  }
}
