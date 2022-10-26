from flask import request
from ..modelos import db, Cancion, CancionSchema, Usuario, UsuarioSchema, Album, AlbumSchema, Album, Comentario, ComentarioSchema, albumes_comentarios
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity

cancion_schema = CancionSchema()
usuario_schema = UsuarioSchema()
album_schema = AlbumSchema()
comentario_schema = ComentarioSchema()

class VistaCanciones(Resource):
    #Se modifica el servicio de post de canciones para que se asocien a los usuarios
    @jwt_required()
    def post(self, id_usuario):
        usuario = Usuario.query.get_or_404(id_usuario)
        nueva_cancion = Cancion(titulo=request.json["titulo"], minutos=request.json["minutos"], segundos=request.json["segundos"], interprete=request.json["interprete"])
        usuario.canciones.append(nueva_cancion)
        db.session.commit()
        return cancion_schema.dump(nueva_cancion)
    #Se modifica el servicio de get de canciones para que traiga las canciones del usuario en sesion
    @jwt_required()
    def get(self, id_usuario):
        usuario = Usuario.query.get_or_404(id_usuario)
        canciones_user = set(usuario.canciones)
        canciones_shared = set(usuario.cancionesCompartidas)
        only_shared = canciones_shared - canciones_user
        result = usuario.canciones + list(only_shared)
        return [cancion_schema.dump(al) for al in result]

class VistaCancion(Resource):

    def get(self, id_cancion):
        return cancion_schema.dump(Cancion.query.get_or_404(id_cancion))

    def put(self, id_cancion):
        cancion = Cancion.query.get_or_404(id_cancion)
        cancion.titulo = request.json.get("titulo",cancion.titulo)
        cancion.minutos = request.json.get("minutos",cancion.minutos)
        cancion.segundos = request.json.get("segundos",cancion.segundos)
        cancion.interprete = request.json.get("interprete",cancion.interprete)
        db.session.commit()
        return cancion_schema.dump(cancion)

    def delete(self, id_cancion):
        cancion = Cancion.query.get_or_404(id_cancion)
        db.session.delete(cancion)
        db.session.commit()
        return '',204

class VistaAlbumesCanciones(Resource):
    def get(self, id_cancion):
        cancion = Cancion.query.get_or_404(id_cancion)
        return [album_schema.dump(al) for al in cancion.albumes]

class VistaCancionesComentarios(Resource):
    # Servicio para cargar los comentarios de una canción
    @jwt_required()
    def get(self, id_cancion):
        cancion = Cancion.query.get_or_404(id_cancion)
        respuesta = []
        for comment in cancion.comentarios:
            user = Usuario.query.get_or_404(comment.usuario)
            comment.nombre_usuario = user.nombre
            respuesta.append(comentario_schema.dump(comment))
        return {"comentarios": respuesta}

    # Servicio para crear un comentario a una canción
    @jwt_required()
    def post(self, id_cancion):
        cancion = Cancion.query.get_or_404(id_cancion)
        nuevo_comentario = Comentario(texto=request.json["texto"], usuario=request.json["usuario_id"])
        cancion.comentarios.append(nuevo_comentario)
        db.session.commit()
        return {"mensaje":"comentario creado"}

class VistaValidarUsuarios(Resource):
    
    def post(self):
        userId = request.json["usuario"]
        usuarios = request.json["correos"].split(',')
        compartir = []
        errores = []
        valido = True
        for user in usuarios:
            usuario = Usuario.query.filter(Usuario.nombre == user).first()
            if usuario is None:
                errores.append(user)
            elif userId == usuario.id:
                valido = False
                return {"valido": valido}
            else:
                if userId != usuario.id:
                  compartir.append(usuario.id)
        return {"valido":valido,"errores":errores,"compartir":compartir}


class VistaSignIn(Resource):
    
    def post(self):
        nuevo_usuario = Usuario(nombre=request.json["nombre"], contrasena=request.json["contrasena"])
        db.session.add(nuevo_usuario)
        db.session.commit()
        token_de_acceso = create_access_token(identity = nuevo_usuario.id)
        return {"mensaje":"usuario creado exitosamente", "token":token_de_acceso}


    def put(self, id_usuario):
        usuario = Usuario.query.get_or_404(id_usuario)
        usuario.contrasena = request.json.get("contrasena",usuario.contrasena)
        db.session.commit()
        return usuario_schema.dump(usuario)

    def delete(self, id_usuario):
        usuario = Usuario.query.get_or_404(id_usuario)
        db.session.delete(usuario)
        db.session.commit()
        return '',204

class VistaLogIn(Resource):

    def post(self):
        usuario = Usuario.query.filter(Usuario.nombre == request.json["nombre"], Usuario.contrasena == request.json["contrasena"]).first()
        db.session.commit()
        if usuario is None:
            return "El usuario no existe", 404
        else:
            token_de_acceso = create_access_token(identity = usuario.id)
            return {"mensaje":"Inicio de sesión exitoso", "token": token_de_acceso}

class VistaAlbumsUsuario(Resource):
    @jwt_required()
    def post(self, id_usuario):
        nuevo_album = Album(titulo=request.json["titulo"], anio=request.json["anio"], descripcion=request.json["descripcion"], medio=request.json["medio"])
        usuario = Usuario.query.get_or_404(id_usuario)
        usuario.albumes.append(nuevo_album)

        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return 'El usuario ya tiene un album con dicho nombre',409

        return album_schema.dump(nuevo_album)

    @jwt_required()
    def get(self, id_usuario):
        usuario = Usuario.query.get_or_404(id_usuario)
        albumes_user = set(usuario.albumes)
        albumes_shared = set(usuario.albumesCompartidos)
        only_shared = albumes_shared - albumes_user
        result = usuario.albumes + list(only_shared)
        return [album_schema.dump(al) for al in result]

class VistaCancionesAlbum(Resource):

    def post(self, id_album):
        album = Album.query.get_or_404(id_album)
        
        if "id_cancion" in request.json.keys():
            
            nueva_cancion = Cancion.query.get(request.json["id_cancion"])
            if nueva_cancion is not None:
                album.canciones.append(nueva_cancion)
                db.session.commit()
            else:
                return 'Canción errónea',404
        else: 
            nueva_cancion = Cancion(titulo=request.json["titulo"], minutos=request.json["minutos"], segundos=request.json["segundos"], interprete=request.json["interprete"])
            album.canciones.append(nueva_cancion)
        db.session.commit()
        return cancion_schema.dump(nueva_cancion)
       
    def get(self, id_album):
        album = Album.query.get_or_404(id_album)
        return [cancion_schema.dump(ca) for ca in album.canciones]

class VistaAlbum(Resource):

    def get(self, id_album):
        return album_schema.dump(Album.query.get_or_404(id_album))

    def put(self, id_album):
        album = Album.query.get_or_404(id_album)
        album.titulo = request.json.get("titulo",album.titulo)
        album.anio = request.json.get("anio", album.anio)
        album.descripcion = request.json.get("descripcion", album.descripcion)
        album.medio = request.json.get("medio", album.medio)
        db.session.commit()
        return album_schema.dump(album)

    def delete(self, id_album):
        album = Album.query.get_or_404(id_album)
        db.session.delete(album)
        db.session.commit()
        return '',204

class VistaCompartirAlbum(Resource):

    @jwt_required()
    def post(self, id_album):
        idUsuario = request.json["idUsuario"]
        nombresUsuario = request.json["nombresUsuario"].split(',')
        errores = []        
        album = Album.query.get_or_404(id_album)
        Usuario.query.get_or_404(idUsuario)

        for nombreUsuario in nombresUsuario:
            usuario = Usuario.query.filter(Usuario.nombre == nombreUsuario).first()

            if usuario is None:
                errores.append(nombreUsuario)
            else:
                usuario.albumesCompartidos.append(album)
        
        if len(errores) == 0:
            db.session.commit()
            return '',204
        else:
            return '',500

class VistaPrueba(Resource):
    @jwt_required()
    def get(self):
        return {"mensaje":"Ok"}
        
class VistaComentarioAlbum(Resource):
    @jwt_required()
    def post(self, id_album, id_usuario):
        album = Album.query.get_or_404(id_album)

        if "id_comentario" in request.json.keys():
            nuevo_comentario = Comentario.query.get(request.json["id_comentario"])
            if nuevo_comentario is not None:
                album.comentarios.append(nuevo_comentario)
                db.session.commit()
            else:
                return 'Comentario erróneo', 404
        else:
            nuevo_comentario = Comentario(texto= request.json["texto"], usuario = id_usuario)
            album.comentarios.append(nuevo_comentario)
        db.session.commit()
        return comentario_schema.dump(nuevo_comentario)

    @jwt_required()
    def get(self, id_album, id_usuario):
        comentarios = db.session.query(albumes_comentarios).filter_by(album_id=id_album).all()
        comentarios_album=[]
        for comment in comentarios:
            comentarios_album.append(Comentario.query.filter(Comentario.id == comment[1]).order_by(Comentario.creado_el.desc()).first())
        return [comentario_schema.dump(co) for co in comentarios_album]

class VistaUsuario(Resource):
    @jwt_required()
    def get(self, id_usuario):
        usuario = Usuario.query.get_or_404(id_usuario)
        return usuario_schema.dump(usuario)

class VistaDropAll(Resource):

    def get(self):
        db.session.remove()
        db.drop_all()
        return {"mensaje":"bd borrada"}

class VistaCompartirCancion(Resource):

    @jwt_required()
    def post(self, id_cancion):
        idUsuario = request.json["idUsuario"]
        nombresUsuario = request.json["nombresUsuario"].split(',')
        errores = []        
        cancion = Cancion.query.get_or_404(id_cancion)
        Usuario.query.get_or_404(idUsuario)

        for nombreUsuario in nombresUsuario:
            usuario = Usuario.query.filter(Usuario.nombre == nombreUsuario).first()

            if usuario is None:
                errores.append(nombreUsuario)
            else:
                usuario.cancionesCompartidas.append(cancion)
        
        if len(errores) == 0:
            db.session.commit()
            return '',204
        else:
            return '',500

        
