import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Album } from "../album/album";
import { AlbumService } from '../album/album.service';
import { UsuarioService } from "../usuario/usuario.service";
import { CancionService } from '../cancion/cancion.service';

@Component({
  selector: 'app-compartir',
  templateUrl: './compartir.component.html',
  styleUrls: ['./compartir.component.css']
})
export class CompartirComponent implements OnInit {

  userId: number;
  token: string;
  album: Album;
  tipoEntidad: string;
  idEntidad: number;
  tituloEntidad: string;
  compartirForm!: FormGroup;
  usuarios: string;
  // listaUsuarios: string[];
  // listaErrores: string[];

  constructor(
    private albumService: AlbumService,
    private cancionService: CancionService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private routerPath: Router) { }

  ngOnInit() {
    if(!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " "){
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.");
      return;
    }

    this.compartirForm = this.formBuilder.group({
      usuarios: ['', [Validators.required, Validators.minLength(1)]]
    });
    this.userId = parseInt(this.router.snapshot.params.userId);
    this.token = this.router.snapshot.params.userToken;

    if(this.esAlbum()){
      this.tipoEntidad = "Álbum";
      this.idEntidad = parseInt(this.router.snapshot.params.id);
      this.albumService.getAlbum(this.idEntidad)
      .subscribe(album => {
        this.tituloEntidad = album.titulo;
      });
    }
    else if(this.esCancion()){
      this.tipoEntidad = "Canción";
      this.idEntidad = parseInt(this.router.snapshot.params.id);
      this.cancionService.getCancion(this.idEntidad)
      .subscribe(cancion => {
        this.tituloEntidad = cancion.titulo;
      });
    }
  }

  showError(error: string){
    this.toastr.error(error, "Error")
  }

  showWarning(warning: string){
    this.toastr.warning(warning, "Advertencia")
  }

  showSuccess(mensaje: string) {
    this.toastr.success(mensaje, "Operación exitosa");
  }

  compartir(newusuarios: string) {
    // Validar usuarios ingresados
    this.usuarioService.validacionUsuarios(this.userId, this.compartirForm.get('usuarios')?.value)
    .subscribe(res => {
      if(!res.valido) {
        this.showWarning("Tu nombre de usuario no puede estar entre los usuarios a compartir");
        return;
      }

      if(res.errores.length == 0) {
        if(this.esAlbum()){
          this.albumService.compartirAlbum(this.userId, this.idEntidad, this.compartirForm.get('usuarios')?.value, this.token)
          .subscribe(res => {
            this.showSuccess("");
            this.compartirForm.reset();
            this.routerPath.navigate([`/albumes/${this.userId}/${this.token}`]);
          },
          error => {
            this.showError("Ha ocurrido un error. " + error.message)
          });
        }else if(this.esCancion()){
          this.cancionService.compartirCancion(this.userId, this.idEntidad, this.compartirForm.get('usuarios')?.value, this.token)
          .subscribe(res => {
            this.showSuccess("");
            this.compartirForm.reset();
            this.routerPath.navigate([`/canciones/${this.userId}/${this.token}`]);
          },
          error => {
            this.showError("Ha ocurrido un error. " + error.message)
          });
        }
      }else {
        this.showWarning(`No se pudo compartir el ${this.tipoEntidad.toLowerCase()} porque estos usuarios no existen: ${res.errores.toString()}`);
        return;
      }
    },
    error => {
      this.showError("Ha ocurrido un error. " + error.message)
    });

    // console.log(this.listaUsuarios);
  }

  cancelarCompartir() {
    if(this.esAlbum()){
      this.routerPath.navigate([`/albumes/${this.userId}/${this.token}`])
    }
    else if(this.esCancion()){
      this.routerPath.navigate([`/canciones/${this.userId}/${this.token}`])
    }
  }

  private esAlbum(){
    return this.router.snapshot.params.entidad.toLowerCase() == "album";
  }

  private esCancion(){
    return this.router.snapshot.params.entidad.toLowerCase() == "cancion";
  }
}
