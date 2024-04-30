import { Injectable } from '@angular/core';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  guardar(token:string, calcularTiempo:Date){
    setCookie('token', token, {expires: calcularTiempo,
      path: '/'})
  }

  obtener(){
    const token = getCookie('token')
    return token
  }

  eliminar() {
    removeCookie('token', {path: '/'})
  }

  refrescar(){
    
  }

}
