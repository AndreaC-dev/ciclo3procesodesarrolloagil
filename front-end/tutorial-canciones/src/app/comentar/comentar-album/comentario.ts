export class Comentario {

  id: number;
  texto:string;
  usuario:number;
  creado_el:Date;
  album:number;
  nombreUsuario:string

  constructor(
    id: number,
    texto:string,
    usuario:number,
    creado_el:Date,
    album:number,
    nombreUsuario:string
    ){
      this.id = id,
      this.texto = texto,
      this.usuario = usuario,
      this.creado_el= creado_el,
      this.album=album,
      this.nombreUsuario = nombreUsuario
  }
}
