import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Comentario } from './comentario';
import {Album} from '../../album/album'
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComentarioService } from '../comentario.service';

@Component({
  selector: 'app-comentar-album',
  templateUrl: './comentar-album.component.html',
  styleUrls: ['./comentar-album.component.css']
})
export class ComentarAlbumComponent implements OnInit {
  @Input() album: Album;
  userId: number;
  token: string;
  comentarioForm: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private routerPath: Router,
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private comentarioService: ComentarioService
  ) { }

  ngOnInit() {
    if(!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " "){
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else{
    this.userId = parseInt(this.router.snapshot.params.userId)
    this.token = this.router.snapshot.params.userToken
    this.comentarioForm=this.formBuilder.group({
      texto: ["", [Validators.required, Validators.minLength(5),Validators.maxLength(1000)]],
    })
    }
  }

  limpiarComentar(){
    this.comentarioForm.reset()
  }

  createComentario(newComentario: Comentario){
    this.comentarioService.crearComentarioAlbum(this.album.id, newComentario,this.userId, this.token)
    .subscribe(comentario => {
      this.showSuccess()
      this.comentarioForm.reset()
      window.location = window.location
    },
    error=> {
      if(error.statusText === "UNAUTHORIZED"){
        this.showWarning("Su sesión ha caducado, por favor vuelva a iniciar sesión.")
      }
      else if(error.statusText === "UNPROCESSABLE ENTITY"){
        this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
      }
      else{
        this.showError("Ha ocurrido un error. " + error.message)
      }
    })}
    showSuccess() {
      this.toastr.success("El comentario fue publicado con éxito.", "Comentario publicado");
    }
    showWarning(warning: string){
      this.toastr.warning(warning, "Error de autenticación")
    }
    showError(error: string){
      this.toastr.error(error, "Error de autenticación")
    }

}
