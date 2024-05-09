import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { checkRequiereToken } from '../../../comun/interceptores/token.interceptor';
import { environment } from '../../../../environments/environment';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http : HttpClient, private tokenService: TokenService, private router: Router) { }

  registro(parametros:any){
    return this.http.post<any>(`${environment.url_api}/usuario/registro`, parametros, {context: checkRequiereToken()});
  }

  login(parametros:any){
    return this.http.post<any>(`${environment.url_api}/login_check`, parametros, {context: checkRequiereToken()});
  }

  logout() {
    localStorage.clear();
    this.tokenService.eliminar();
    this.router.navigate(['']);
  }
}
