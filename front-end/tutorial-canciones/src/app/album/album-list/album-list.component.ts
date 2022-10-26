import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { Comentario } from 'src/app/comentar/comentar-album/comentario';
import { Album, Cancion } from '../album';
import { AlbumService } from '../album.service';
import {ComentarioService} from '../../comentar/comentario.service'
import { Usuario } from 'src/app/usuario/usuario';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.css']
})
export class AlbumListComponent implements OnInit {

  constructor(
    private albumService: AlbumService,
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private routerPath: Router,
    private comentarioService: ComentarioService,
  ) {
  }

  userId: number
  token: string
  albumes: Array<Album>
  mostrarAlbumes: Array<Album>
  albumSeleccionado: Album
  indiceSeleccionado: number
  itemsPerPage = 5;
  pageSize: any;
  currentPage: any;
  comentariosAlbumes: Array<any>;
  usuario: Usuario;
  usuarios: Usuario


  ngOnInit() {
    if (!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " ") {
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    } else {
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken
      this.getAlbumes();
    }
  }

  getAlbumes(): void {
    this.albumService.getAlbumes(this.userId, this.token)
      .subscribe(albumes => {
          this.albumes = albumes
          this.mostrarAlbumes = albumes
          if (albumes.length > 0) {
            this.onSelect(this.mostrarAlbumes[0], 0)
            this.currentPage = 1;
          }
        },
        error => {
          this.manejoErrores(error)
        })

  }

  onSelect(a: Album, index: number) {
    this.indiceSeleccionado = index
    this.albumSeleccionado = a
    this.albumService.getCancionesAlbum(a.id, this.token)
      .subscribe(canciones => {
          this.albumSeleccionado.canciones = canciones
          this.albumSeleccionado.interpretes = this.getInterpretes(canciones)
        },
        error => {
          this.showError("Ha ocurrido un error, " + error.message)
        })
    this.alimentar(a)
  }

  alimentar(a: Album) {
    this.comentarioService.getComentariosAlbum(a.id, this.userId, this.token)
      .subscribe(comentarios => {
          this.comentariosAlbumes = comentarios
          this.mostrarNombreUsario(this.comentariosAlbumes)
        },
        error => {
          this.showError("Ha ocurrido un error, " + error.message)
        })
  }

  irCompartir(a: Album, index: number) {
    this.routerPath.navigate([`/compartir/album/${a.id}/${this.userId}/${this.token}`])
  }

  getInterpretes(canciones: Array<Cancion>): Array<string> {
    var interpretes: Array<string> = []
    canciones.map(c => {
      if (!interpretes.includes(c.interprete)) {
        interpretes.push(c.interprete)
      }
    })
    return interpretes
  }

  buscarAlbum(busqueda: string) {
    let albumesBusqueda: Array<Album> = []
    this.albumes.map(albu => {
      if (albu.titulo.toLocaleLowerCase().includes(busqueda.toLowerCase())) {
        albumesBusqueda.push(albu)
      }
    })
    this.mostrarAlbumes = albumesBusqueda
  }

  irCrearAlbum() {
    this.routerPath.navigate([`/albumes/create/${this.userId}/${this.token}`])
  }

  eliminarAlbum() {
    this.albumService.eliminarAlbum(this.userId, this.token, this.albumSeleccionado.id)
      .subscribe(album => {
          this.ngOnInit();
          this.showSuccess();
        },
        error => {
          this.manejoErrores(error)
        })
    this.ngOnInit()
  }

  showError(error: string) {
    this.toastr.error(error, "Error de autenticación")
  }

  showWarning(warning: string) {
    this.toastr.warning(warning, "Error de autenticación")
  }

  showSuccess() {
    this.toastr.success(`El album fue eliminado`, "Eliminado exitosamente");
  }

  onPageChange(pageNum: number): void {
    this.pageSize = this.itemsPerPage * (pageNum - 1);
  }

  mostrarNombreUsario(comentariosAlbumes:Array<Comentario>) {
    for (let value in comentariosAlbumes) {
      this.comentarioService.getmostrarUsuario(comentariosAlbumes[value]['usuario'], this.token)
        .subscribe(usuarios => {
            this.comentariosAlbumes[value]['nombreUsuario'] = usuarios.nombre
            this.ordering(this.comentariosAlbumes)
          },
          error => {
            this.showError("Ha ocurrido un error, " + error.message)
          })
    }
  }
  ordering(comentariosAlbumes:Array<Comentario>){
    this.comentariosAlbumes=comentariosAlbumes.sort((n1,n2) =>{
      if(n1.creado_el>n2.creado_el){
        return 1;
      }
      if(n1.creado_el<n2.creado_el){
        return -1;
      }
      return 0;
    })

  }

  manejoErrores(error:any) {
    {
      if (error.statusText === "UNAUTHORIZED") {
        this.showWarning("Su sesión ha caducado, por favor vuelva a iniciar sesión.")
      } else if (error.statusText === "UNPROCESSABLE ENTITY") {
        this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
      } else {
        this.showError("Ha ocurrido un error. " + error.message)
      }
    }
  }

}
