import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Album } from "../../album/album";
import { AlbumService } from '../../album/album.service';
import { UsuarioService } from "../../usuario/usuario.service";

@Component({
  selector: 'app-compartir-album',
  templateUrl: './compartir-album.component.html',
  styleUrls: ['./compartir-album.component.css']
})
export class CompartirAlbumComponent implements OnInit {

  userId: number;
  token: string;
  album: Album;
  compartirForm!: FormGroup;
  usuarios: string
  listaUsuarios: string[]
  listaErrores: string[]
  valido: boolean


  constructor(
    private albumService: AlbumService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private routerPath: Router) { }

  ngOnInit() {
    if(!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " "){
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }else {
      this.albumService.getAlbum(parseInt(this.router.snapshot.params.albumId))
      .subscribe(album => {
        this.album = album
        this.compartirForm = this.formBuilder.group({
          usuarios: ['', [Validators.required, Validators.minLength(1)]]
        })
      })
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken
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

  compartirAlbum(newusuarios: string) {
    // Validar usuarios ingresados
    this.usuarioService.validacionUsuarios(this.userId, this.compartirForm.get('usuarios')?.value)
    .subscribe(res => {
      this.valido = res.valido
      if(!this.valido) {
        this.showWarning("Tu nombre de usuario no puede estar entre los usuarios a compartir")
      }else {
        this.listaErrores = res.errores
        this.listaUsuarios = res.compartir
        if(this.listaErrores.length == 0) {
          this.albumService.compartirAlbum(this.userId, this.album.id, this.compartirForm.get('usuarios')?.value, this.token)
          .subscribe(res => {
            this.showSuccess("");
            this.compartirForm.reset();
            this.routerPath.navigate([`/albumes/${this.userId}/${this.token}`]);
          },
          error => {
            this.showError("Ha ocurrido un error. " + error.message)
          });
        }else {
          this.showWarning('No se pudo compartir el álbum porque estos usuarios no existen: '
          + this.listaErrores.toString())
          return
        }
      }
    },
    error => {
      this.showError("Ha ocurrido un error. " + error.message)
    });
    console.log(this.listaUsuarios)
  }

  cancelarCompartir() {
    this.routerPath.navigate([`/albumes/${this.userId}/${this.token}`])
  }

}
