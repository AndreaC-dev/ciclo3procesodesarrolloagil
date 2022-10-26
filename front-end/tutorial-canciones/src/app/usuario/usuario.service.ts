import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class UsuarioService {

    private backUrl: string = environment.api_url;

    constructor(private http: HttpClient) { }

    userLogIn(nombre: string, contrasena: string):Observable<any>{
        return this.http.post<any>(`${this.backUrl}/logIn`, {"nombre": nombre, "contrasena": contrasena });
    }

    userSignUp(nombre: string, contrasena: string): Observable<any>{
        return this.http.post<any>(`${this.backUrl}/signin`, {"nombre": nombre, "contrasena": contrasena})
    }

    validacionUsuarios(usuario: number, correos: string): Observable<any> {
      return this.http.post<any>(`${this.backUrl}/usuario/validar`, {"usuario": usuario, "correos":correos})
    }
}
