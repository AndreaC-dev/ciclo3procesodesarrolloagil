import sys
import os.path as path
three_up = path.abspath(path.join(__file__ ,"../../.."))
sys.path.append(
    path.abspath(path.join(path.dirname(__file__), three_up)))
from flaskr import create_app
import unittest
import json
from flask_jwt_extended import JWTManager
from flask_cors import CORS, cross_origin

class TestPrueba(unittest.TestCase):

    def setUp(self):
        # Se levanta app
        self.app = create_app('testing')
        cors = CORS(self.app)
        jwt = JWTManager(self.app)
        self.client = self.app.test_client
        # Se crea usuario
        usuario = json.dumps({"nombre": "prueba", "contrasena": "prueba"})
        resp_signin =self.client().post('/signin', headers={"Content-Type": "application/json"}, data=usuario)
        # Crear album
        headers = {"Content-Type": "application/json", "Authorization": "Bearer {}".format(resp_signin.json["token"])}
        album = json.dumps({"titulo": "Revolver", "anio": "1966", "descripcion": "Septimo album de los Beatles", "medio": "CASETE"})
        self.client().post('/usuario/1/albumes', headers=headers, data=album)

    def test_consultar_comentarios(self):
        # Se hace login
        usuario = json.dumps({"nombre": "prueba", "contrasena": "prueba"})
        resp_logIn = self.client().post('/logIn', headers={"Content-Type": "application/json"}, data=usuario)
        # Se consultan comentarios
        headers = {"Content-Type": "application/json", "Authorization": "Bearer {}".format(resp_logIn.json["token"])}
        resp_prueba = self.client().get('/usuario/1/album/1/comentarios', headers=headers)
        # Se comprueba que los comentarios deben estar vacíos
        self.assertEqual(len(resp_prueba.json), 0)
        # Se crea comentario para la canción
        comentario = json.dumps({"texto": "El mejor album del mundo", "usuario_id": "1"})
        resp_prueba = self.client().post('/usuario/1/album/1/comentarios', headers=headers, data=comentario)
        # Se comprueba creación
        self.assertEqual(resp_prueba.json["texto"], "El mejor album del mundo")
        # Se consultan comentarios
        resp_prueba = self.client().get('/usuario/1/album/1/comentarios', headers=headers)
        # Se comprueba que debe traer un comentario
        self.assertEqual(len(resp_prueba.json), 1)
        #Se comprueba que el comentario sea igual al ingresado
        comentario = resp_prueba.json[0]["texto"]
        self.assertEqual(comentario, "El mejor album del mundo")
        # Se crea comentario para la canción
        comentario2 = json.dumps({"texto": "No me parece tan buena la canción", "usuario_id": "1"})
        resp_prueba = self.client().post('/usuario/1/album/1/comentarios', headers=headers, data=comentario2)
        # Se comprueba creación
        self.assertEqual(resp_prueba.json["texto"], "No me parece tan buena la canción")
        # Se consultan comentarios
        resp_prueba = self.client().get('/usuario/1/album/1/comentarios', headers=headers)
        # Se comprueba que debe traer dos comentarios
        self.assertEqual(len(resp_prueba.json), 2)

    def test_crear_comentario_ok(self):
        # Se hace login
        usuario = json.dumps({"nombre": "prueba", "contrasena": "prueba"})
        resp_logIn = self.client().post('/logIn', headers={"Content-Type": "application/json"}, data=usuario)
        # Crear comentario
        headers = {"Content-Type": "application/json", "Authorization": "Bearer {}".format(resp_logIn.json["token"])}
        comentario = json.dumps({"texto": "La mejor cancion del mundo", "usuario_id": "1"})
        resp_prueba = self.client().post('/usuario/1/album/1/comentarios', headers=headers, data=comentario)
        # Se comprueba test
        self.assertEqual(resp_prueba.status_code, 200)

    def test_crear_comentario_404(self):
        # Se hace login
        usuario = json.dumps({"nombre": "prueba", "contrasena": "prueba"})
        resp_logIn = self.client().post('/logIn', headers={"Content-Type": "application/json"}, data=usuario)
        # Crear comentario
        headers = {"Content-Type": "application/json", "Authorization": "Bearer {}".format(resp_logIn.json["token"])}
        comentario = json.dumps({"texto": "La mejor cancion del mundo", "usuario_id": "1"})
        resp_prueba = self.client().post('/usuario/1/album/5/comentarios', headers=headers, data=comentario)
        # Se comprueba test
        self.assertEqual(resp_prueba.status, "404 NOT FOUND")
    #
    def tearDown(self):
        # Se elimina bd
        self.client().get('/dropall', headers={"Content-Type": "application/json"})
