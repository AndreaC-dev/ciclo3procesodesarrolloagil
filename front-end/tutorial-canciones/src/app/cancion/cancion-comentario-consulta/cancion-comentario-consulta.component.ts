import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cancion } from 'src/app/album/album';
import { CancionComentario } from "../cancion-comentario";
import { CancionService } from '../cancion.service';

@Component({
  selector: 'app-cancion-comentario-consulta',
  templateUrl: './cancion-comentario-consulta.component.html',
  styleUrls: ['./cancion-comentario-consulta.component.css']
})
export class CancionComentarioConsultaComponent implements OnInit {

  cancionComentarios: Array<CancionComentario> = new Array<CancionComentario>();
  constructor(
    private router: ActivatedRoute,
    private cancionService: CancionService,
  ) { }

  @Input() cancionConsultar: Cancion;
  userId: number
  token: string


  ngOnInit(): void {
    this.userId = parseInt(this.router.snapshot.params.userId)
    this.token = this.router.snapshot.params.userToken
    this.getCancionCometario();
  }

  ngOnChanges(): void {
    this.getCancionCometario();
  }

  getCancionCometario(): void {
    this.cancionService.consultarComentariosCancion(this.cancionConsultar.id, this.token)
      .subscribe(res => {
        this.cancionComentarios = res.comentarios
        this.cancionComentarios = this.cancionComentarios.sort((a, b) => b.id - a.id);
      }
      )
  }

}
