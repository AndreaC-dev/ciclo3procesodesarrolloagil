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

    def levantarApp(self):
        self.app = create_app('testing')
        cors = CORS(self.app)
        jwt = JWTManager(self.app)
        self.client = self.app.test_client

    def crearUsuarioyCancion(self):
        usuario = json.dumps({"nombre": "prueba", "contrasena": "prueba"})
        resp_signin = self.client().post('/signin', headers={"Content-Type": "application/json"}, data=usuario)
        headers = {"Content-Type": "application/json", "Authorization": "Bearer {}".format(resp_signin.json["token"])}
        cancion = json.dumps({"titulo": "libre", "minutos": "5", "segundos": "12", "interprete": "Mana"})
        self.client().post('/usuario/1/canciones', headers=headers, data=cancion)

    def login(self):
        usuario = json.dumps({"nombre": "prueba", "contrasena": "prueba"})
        return {"Content-Type": "application/json", "Authorization": "Bearer {}".format(self.client().post('/logIn', headers={"Content-Type": "application/json"}, data=usuario).json["token"])}

    def consultarComentarios(self, headers):
        return self.client().get('/comentarios/cancion/1', headers=headers)

    def crearComentarioCancion(self, headers, comentario, idCancion):
        return self.client().post('/comentarios/cancion/'+idCancion, headers=headers, data=comentario)

    def setUp(self):
        self.levantarApp()
        self.crearUsuarioyCancion()

    def test_consultar_comentarios(self):
        headers = self.login()
        self.assertEqual(len(self.consultarComentarios(headers).json["comentarios"]), 0)
        self.assertEqual(self.crearComentarioCancion(headers, json.dumps({"texto": "La mejor cancion del mundo", "usuario_id": "1"}),'1').json["mensaje"], "comentario creado")
        resp_prueba = self.consultarComentarios(headers)
        self.assertEqual(len(resp_prueba.json["comentarios"]), 1)
        self.assertEqual(resp_prueba.json["comentarios"][0]["texto"], "La mejor cancion del mundo")
        self.assertEqual(self.crearComentarioCancion(headers, json.dumps({"texto": "No me parece tan buena la canción", "usuario_id": "1"}),'1').json["mensaje"], "comentario creado")
        self.assertEqual(len(self.consultarComentarios(headers).json["comentarios"]), 2)

    def test_crear_comentario_ok(self):
        headers = self.login()
        self.assertEqual(self.crearComentarioCancion(headers,json.dumps({"texto": "La mejor cancion del mundo", "usuario_id": "1"}),'1') .json["mensaje"], "comentario creado")

    def test_crear_comentario_404(self):
        headers = self.login()
        self.assertEqual(self.crearComentarioCancion(headers,json.dumps({"texto": "La mejor cancion del mundo", "usuario_id": "1"}),'5').status, "404 NOT FOUND")

    def tearDown(self):
        self.client().get('/dropall', headers={"Content-Type": "application/json"})
