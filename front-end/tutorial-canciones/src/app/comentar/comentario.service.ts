import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../usuario/usuario';
import { Comentario } from './comentar-album/comentario';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {

  private backUrl: string = environment.api_url;

  constructor(private http: HttpClient) { }

  getComentariosAlbum(idAlbum: number,idUsuario:number, token: string):Observable<Comentario[]>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<Comentario[]>(`${this.backUrl}/usuario/${idUsuario}/album/${idAlbum}/comentarios`,{headers: headers})
  }

  crearComentarioAlbum(idAlbum: number, comentario: Comentario, idUsuario:number,token: string):Observable<Comentario>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.post<Comentario>(`${this.backUrl}/usuario/${idUsuario}/album/${idAlbum}/comentarios`, comentario, {headers: headers})
  }
  getmostrarUsuario(idUsuario:number,token: string):Observable<Usuario>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<Usuario>(`${this.backUrl}/usuario/${idUsuario}`, {headers: headers})
  }

}
