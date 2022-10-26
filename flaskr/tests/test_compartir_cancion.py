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
        self.app = create_app("testing")
        cors = CORS(self.app)
        jwt = JWTManager(self.app)
        self.client = self.app.test_client
        # Se crea usuario
        usuario = json.dumps({"nombre": "prueba", "contrasena": "prueba"})
        resp_signin =self.client().post('/signin', headers={"Content-Type": "application/json"}, data=usuario)
        # Crear cancion
        headers = {"Content-Type": "application/json", "Authorization": "Bearer {}".format(resp_signin.json["token"])}
        cancion = json.dumps({"titulo": "Papercut", "minutos": "3", "segundos": "5", "interprete": "Chester Bennington"})
        self.client().post("/usuario/1/canciones", headers=headers, data=cancion)

    def test_compartir_cancion_sin_token_retorna_401(self):
        headers = {"Content-Type": "application/json"}
        peticion = json.dumps({"idUsuario": "1", "nombresUsuario": "prueba2@gmail.com"})

        respuestaCompartir = self.client().post('/cancion/1/compartir', headers=headers, data=peticion)
        
        self.assertEqual(respuestaCompartir.status_code, 401)

    def test_compartir_cancion_inexistente_retorna_404(self):
        usuario = json.dumps({"nombre": "prueba", "contrasena": "prueba"})
        respuestaLogin = self.client().post('/logIn', headers={"Content-Type": "application/json"}, data=usuario)
        headers = {"Content-Type": "application/json", "Authorization": "Bearer {}".format(respuestaLogin.json["token"])}
        peticionCompartir = json.dumps({"idUsuario": "prueba", "nombresUsuario": "prueba2@gmail.com"})

        respuestaCompartir = self.client().post('/cancion/123456789/compartir', headers=headers, data=peticionCompartir)
        
        self.assertEqual(respuestaCompartir.status_code, 404)
    
    def test_compartir_cancion_existente_con_usuario_inexistente_retorna_500(self):        
        usuario = json.dumps({"nombre": "prueba", "contrasena": "prueba"})
        respuestaLogin = self.client().post('/logIn', headers={"Content-Type": "application/json"}, data=usuario)
        headers = {"Content-Type": "application/json", "Authorization": "Bearer {}".format(respuestaLogin.json["token"])}
        peticionCompartir = json.dumps({"idUsuario": "1", "nombresUsuario": "prueba2@gmail.com"})

        respuestaCompartir = self.client().post('/cancion/1/compartir', headers=headers, data=peticionCompartir)
        
        self.assertEqual(respuestaCompartir.status_code, 500)

    def test_compartir_cancion_existente_con_usuario_existente_retorna_204(self):
        usuario2 = json.dumps({"nombre": "prueba2@gmail.com", "contrasena": "prueba"})
        self.client().post('/signin', headers={"Content-Type": "application/json"}, data=usuario2)
        respuestaLoginUsuario2 = self.client().post('/logIn', headers={"Content-Type": "application/json"}, data=usuario2)
        headersUsuario2 = {"Content-Type": "application/json", "Authorization": "Bearer {}".format(respuestaLoginUsuario2.json["token"])}        
        usuario1 = json.dumps({"nombre": "prueba", "contrasena": "prueba"})
        respuestaLoginUsuario1 = self.client().post('/logIn', headers={"Content-Type": "application/json"}, data=usuario1)
        headersUsuario1 = {"Content-Type": "application/json", "Authorization": "Bearer {}".format(respuestaLoginUsuario1.json["token"])}
        peticionCompartir = json.dumps({"idUsuario": "1", "nombresUsuario": "prueba2@gmail.com"})

        respuestaCompartir = self.client().post('/cancion/1/compartir', headers=headersUsuario1, data=peticionCompartir)
        
        self.assertEqual(respuestaCompartir.status_code, 204)
        respuestaObtenerCanciones = self.client().get('/usuario/2/canciones', headers=headersUsuario2)
        self.assertEqual(respuestaObtenerCanciones.status_code, 200)
        self.assertEqual(len(respuestaObtenerCanciones.json), 1)
        self.assertEqual(respuestaObtenerCanciones.json[0]["titulo"], "Papercut")
        self.assertEqual(respuestaObtenerCanciones.json[0]["interprete"], "Chester Bennington")
        self.assertEqual(respuestaObtenerCanciones.json[0]["minutos"], 3)
        self.assertEqual(respuestaObtenerCanciones.json[0]["segundos"], 5)

    def tearDown(self):
        self.client().get('/dropall', headers={"Content-Type": "application/json"})