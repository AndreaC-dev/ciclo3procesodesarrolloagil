import { Comentario } from "../comentar/comentar-album/comentario";

export class Album {

    id: number;
    titulo: string;
    anio: number;
    descripcion: string;
    medio: Medio;
    usuario: number;
    nombreUsuario:string;
    interpretes: Array<string>;
    canciones: Array<Cancion>;
    comentarios: Array<Comentario>

    constructor(
        id: number,
        titulo: string,
        anio: number,
        descripcion: string,
        medio: Medio,
        usuario: number,
        nombreUsuario:string,
        interpretes: Array<string>,
        canciones: Array<Cancion>,
        comentarios: Array<Comentario>
    ){
        this.id = id,
        this.titulo = titulo,
        this.anio = anio,
        this.descripcion = descripcion,
        this.medio = medio,
        this.usuario = usuario,
        this.nombreUsuario = nombreUsuario,
        this.interpretes = interpretes,
        this.canciones = canciones,
        this.comentarios = comentarios
    }
}

export class Medio{
    llave: string;
    valor: number

    constructor(
        llave: string,
        valor:number
    ){
        this.llave = llave,
        this.valor = valor
    }
}

export class Cancion{
    id: number;
    titulo: string;
    minutos: number;
    segundos: number;
    interprete: string;

    constructor(
        id: number,
        titulo: string,
        minutos: number,
        segundos: number,
        interprete: string
    ){
        this.id = id,
        this.titulo = titulo,
        this.minutos = minutos,
        this.segundos = segundos,
        this.interprete = interprete
    }
}
