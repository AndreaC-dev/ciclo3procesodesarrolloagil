import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Album} from './album';
import { Cancion } from '../cancion/cancion';
import { environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  private backUrl: string = environment.api_url;

  constructor(private http: HttpClient) { }

  getAlbumes(usuario: number, token: string): Observable<Album[]>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<Album[]>(`${this.backUrl}/usuario/${usuario}/albumes`, {headers: headers})
  }

  getCancionesAlbum(idAlbum: number, token: string): Observable<Cancion[]>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<Cancion[]>(`${this.backUrl}/album/${idAlbum}/canciones`, {headers: headers})
  }

  crearAlbum(idUsuario: number, token: string, album: Album):Observable<Album>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.post<Album>(`${this.backUrl}/usuario/${idUsuario}/albumes`, album, {headers: headers})
  }

  getAlbum(albumId: number): Observable<Album>{
    return this.http.get<Album>(`${this.backUrl}/album/${albumId}`)
  }

  editarAlbum(idUsuario: number, token: string, albumId: number, album: Album): Observable<Album>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.put<Album>(`${this.backUrl}/album/${albumId}`, album, {headers: headers})
  }

  eliminarAlbum(idUsuario: number, token: string, albumId: number): Observable<Album>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.delete<Album>(`${this.backUrl}/album/${albumId}`, {headers: headers})
  }

  asociarCancion(albumId: number, cancionId: number): Observable<Cancion>{
    return this.http.post<Cancion>(`${this.backUrl}/album/${albumId}/canciones`, {"id_cancion": cancionId})
  }

  compartirAlbum(idUsuario: number, idAlbum: number, nombresUsuario:string, token: string):Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.backUrl}/album/${idAlbum}/compartir`, {"idUsuario": idUsuario, "nombresUsuario":nombresUsuario}, {headers: headers});
  }

}
