from flask import Flask
from .instance.config import app_config
from flask_restful import Api
from .modelos import db
from .vistas import VistaCanciones, VistaCancion, VistaValidarUsuarios, VistaSignIn, VistaAlbum, VistaAlbumsUsuario, VistaCancionesAlbum, VistaLogIn, VistaAlbumesCanciones, VistaCompartirAlbum, VistaCancionesComentarios,VistaComentarioAlbum, VistaPrueba, VistaDropAll, VistaUsuario, VistaCompartirCancion

def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(app_config[config_name])
    app.config.from_pyfile('instance/config.py')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    app_context = app.app_context()
    app_context.push()

    db.init_app(app)
    db.create_all()


    api = Api(app)
    api.add_resource(VistaCanciones, '/usuario/<int:id_usuario>/canciones')
    api.add_resource(VistaCancion, '/cancion/<int:id_cancion>')
    api.add_resource(VistaAlbumesCanciones, '/cancion/<int:id_cancion>/albumes')
    api.add_resource(VistaSignIn, '/signin')
    api.add_resource(VistaLogIn, '/logIn')
    api.add_resource(VistaValidarUsuarios, '/usuario/validar')
    api.add_resource(VistaAlbumsUsuario, '/usuario/<int:id_usuario>/albumes')
    api.add_resource(VistaAlbum, '/album/<int:id_album>')
    api.add_resource(VistaCancionesAlbum, '/album/<int:id_album>/canciones')
    api.add_resource(VistaCompartirAlbum, '/album/<int:id_album>/compartir')
    api.add_resource(VistaCancionesComentarios, '/comentarios/cancion/<int:id_cancion>')
    api.add_resource(VistaComentarioAlbum, '/usuario/<int:id_usuario>/album/<int:id_album>/comentarios')
    api.add_resource(VistaPrueba, '/prueba')
    api.add_resource(VistaDropAll, '/dropall')
    api.add_resource(VistaUsuario, '/usuario/<int:id_usuario>')
    api.add_resource(VistaCompartirCancion, '/cancion/<int:id_cancion>/compartir')

    return app
