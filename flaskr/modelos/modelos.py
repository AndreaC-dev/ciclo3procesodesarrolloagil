from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema, auto_field
from marshmallow import fields
import enum


db = SQLAlchemy()

albumes_canciones = db.Table('album_cancion',
    db.Column('album_id', db.Integer, db.ForeignKey('album.id'), primary_key = True),
    db.Column('cancion_id', db.Integer, db.ForeignKey('cancion.id'), primary_key = True))

albumes_usuarios = db.Table('album_usuario',
    db.Column('album_id', db.Integer, db.ForeignKey('album.id'), primary_key = True),
    db.Column('usuario_id', db.Integer, db.ForeignKey('usuario.id'), primary_key = True))

canciones_usuarios = db.Table('cancion_usuario',
    db.Column('cancion_id', db.Integer, db.ForeignKey('cancion.id'), primary_key = True),
    db.Column('usuario_id', db.Integer, db.ForeignKey('usuario.id'), primary_key = True))

# Tabla para relacionar comentarios con su respectiva
canciones_comentarios = db.Table('cancion_comentario',
    db.Column('cancion_id', db.Integer, db.ForeignKey('cancion.id'), primary_key = True),
    db.Column('comentario_id', db.Integer, db.ForeignKey('comentario.id'), primary_key = True))
    
albumes_comentarios = db.Table('album_comentario',
    db.Column('album_id', db.Integer, db.ForeignKey('album.id'), primary_key = True),
    db.Column('comentario_id', db.Integer, db.ForeignKey('comentario.id'), primary_key = True))

class Cancion(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    titulo = db.Column(db.String(128))
    minutos = db.Column(db.Integer)
    segundos = db.Column(db.Integer)
    interprete = db.Column(db.String(128))
    usuario = db.Column(db.Integer, db.ForeignKey("usuario.id"))
    albumes = db.relationship('Album', secondary = 'album_cancion', back_populates="canciones")
    comentarios = db.relationship('Comentario', secondary = 'cancion_comentario', backref="cancion")

class Medio(enum.Enum):
   DISCO = 1
   CASETE = 2
   CD = 3

class Album(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(128))
    anio = db.Column(db.Integer)
    descripcion = db.Column(db.String(512))
    medio = db.Column(db.Enum(Medio))
    usuario = db.Column(db.Integer, db.ForeignKey("usuario.id"))
    canciones = db.relationship('Cancion', secondary = 'album_cancion', back_populates="albumes")
    comentarios = db.relationship('Comentario', secondary = 'album_comentario', backref="album")

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50))
    contrasena = db.Column(db.String(50))
    albumes = db.relationship('Album', cascade='all, delete, delete-orphan')
    albumesCompartidos = db.relationship('Album', secondary = 'album_usuario')
    canciones = db.relationship('Cancion', cascade='all, delete, delete-orphan')
    cancionesCompartidas = db.relationship('Cancion', secondary = 'cancion_usuario')

# Modelo para guardar los comentarios realizados por los usuarios
class Comentario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    texto = db.Column(db.String(1000))
    usuario = db.Column(db.Integer, db.ForeignKey("usuario.id"))
    creado_el = db.Column(db.DateTime(timezone=True), server_default=func.now())

class EnumADiccionario(fields.Field):
    def _serialize(self, value, attr, obj, **kwargs):
        if value is None:
            return None
        return {"llave": value.name, "valor": value.value}

# Clase auxiliar utilizada para traer el nombre del usuario que realizó un comentario
class InfoUsuario(fields.Field):
    def _serialize(self, value, attr, obj, **kwargs):
        if value is None:
            return None
        return  value

class CancionSchema(SQLAlchemyAutoSchema):
    class Meta:
         model = Cancion
         include_relationships = True
         include_fk = True
         load_instance = True

class AlbumSchema(SQLAlchemyAutoSchema):
    medio = EnumADiccionario(attribute=("medio"))
    class Meta:
         model = Album
         include_relationships = True
         include_fk = True
         load_instance = True

class UsuarioSchema(SQLAlchemyAutoSchema):
    class Meta:
         fields = ("nombre",)
         model = Usuario
         include_relationships = True
         load_instance = True

class ComentarioSchema(SQLAlchemyAutoSchema):
    nombre_usuario = InfoUsuario(attribute=("nombre_usuario"))
    class Meta:
        model = Comentario
        load_instance = True
        include_relationships = True
        include_fk = True
