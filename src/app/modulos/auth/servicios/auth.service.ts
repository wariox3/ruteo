import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { checkRequiereToken } from '../../../comun/interceptores/token.interceptor';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http : HttpClient) { }

  registro(parametros:any){
    return this.http.post<any>(`${environment.url_api}/usuario/registro`, parametros, {context: checkRequiereToken()});
  }

  login(parametros:any){
    return this.http.post<any>(`${environment.url_api}/login_check`, parametros, {context: checkRequiereToken()});
  }
}
