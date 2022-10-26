import { Component, Output, Input, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Cancion } from 'src/app/album/album';
import { CancionComentario } from "../cancion-comentario";
import { CancionService } from '../cancion.service';

@Component({
  selector: 'app-cancion-comentarios-crear',
  templateUrl: './cancion-comentarios-crear.component.html',
  styleUrls: ['./cancion-comentarios-crear.component.css']
})
export class CancionComentariosCrearComponent implements OnInit {

  @Input() cancionComentar: Cancion;
  @Output()
  eventoConsultarComentario = new EventEmitter<string>();
  cancionComentarioForm: FormGroup
  userId: number
  token: string

  constructor(
    private cancionService: CancionService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.userId = parseInt(this.router.snapshot.params.userId)
    this.token = this.router.snapshot.params.userToken
    this.cancionComentarioForm = this.formBuilder.group({
      comentario: ["", [Validators.required, Validators.minLength(5), Validators.maxLength(1000)]],
    })

  }

  ngOnChanges(): void {
    this.cancionComentarioForm = this.formBuilder.group({
      comentario: ["", [Validators.required, Validators.minLength(5), Validators.maxLength(1000)]],
    })
  }

  createComentario(newComentario: any) {
    let cancionComentario: CancionComentario;
    cancionComentario = new CancionComentario(0, this.cancionComentar, '', this.userId, new Date, newComentario.comentario);
    this.cancionService.crearComentarioCancion(cancionComentario, this.token).subscribe(() => {
      this.showSuccess()
      this.cancionComentarioForm.reset()
      this.eventoConsultarComentario.emit("comentario crear")
    },
      error => {
        if (error.statusText === "UNAUTHORIZED") {
          this.showWarning("Su sesión ha caducado, por favor vuelva a iniciar sesión.")
        }
        else if (error.statusText === "UNPROCESSABLE ENTITY") {
          this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
        }
        else {
          this.showError("Ha ocurrido un error. " + error.message)
        }
      })
    this.showSuccess()
  }

  showError(error: string) {
    this.toastr.error(error, "Error")
  }

  showWarning(warning: string) {
    this.toastr.warning(warning, "Error de autenticación")
  }

  showSuccess() {
    this.toastr.success("El comentario fue publicado con exito", "Comentario Publicado");
  }

}
