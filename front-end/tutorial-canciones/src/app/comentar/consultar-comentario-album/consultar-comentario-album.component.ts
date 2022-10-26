import { Component, Input, OnInit } from '@angular/core';
import { Comentario } from '../comentar-album/comentario';
import {Album} from '../../album/album'
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComentarioService } from '../comentario.service';
import {Usuario} from "../../usuario/usuario"

@Component({
  selector: 'app-consultar-comentario-album',
  templateUrl: './consultar-comentario-album.component.html',
  styleUrls: ['./consultar-comentario-album.component.css']
})
export class ConsultarComentarioAlbumComponent implements OnInit {
  @Input() comentariosAlbumes:Array<Comentario>;
  @Input() usuario:Usuario;
  userId: number;
  token: string;
  comentarioForm: FormGroup


  constructor(
    private formBuilder: FormBuilder,
    private routerPath: Router,
    private router: ActivatedRoute,
    private toastr: ToastrService,
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
    showSuccess() {
      this.toastr.success("El comentario fue publicado con éxito.", "Comentario publicado");
    }
    showWarning(warning: string){
      this.toastr.warning(warning, "Error de autenticación")
    }
    showError(error: string){
      this.toastr.error(error, "Error de autenticación")
    }
    orderBy(prop:string) {
      return this.comentariosAlbumes.sort((a, b) => a['creado_el'] > b['creado_el'] ? -1 : a['creado_el'] === b['creado_el'] ? 0 : 1);
    }

}
