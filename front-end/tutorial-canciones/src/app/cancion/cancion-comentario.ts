import { Cancion } from "../album/album";
import { Usuario } from "../usuario/usuario";

export class CancionComentario {
  id: number;
  cancion: Cancion;
  nombre_usuario: string;
  usuario_id:number;
  creado_el: Date;
  texto: string;

  constructor(
    id: number,
    cancion: Cancion,
    nombre_usuario: string,
    usuario_id:number,
    creado_el: Date,
    texto:string,
  ) {
    this.id = id;
    this.cancion = cancion;
    this.nombre_usuario = nombre_usuario;
    this.usuario_id = usuario_id;
    this.creado_el = creado_el;
    this.texto = texto;
  }
}
