import sys
import os.path as path
three_up = path.abspath(path.join(__file__ ,"../../.."))
sys.path.append(
    path.abspath(path.join(path.dirname(__file__), three_up)))
import unittest
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flaskr import create_app


class RelacionarUsuarioCancionTestCase(unittest.TestCase):

    def setUp(self):
        # Se levanta app
        self.app = create_app('testing')
        cors = CORS(self.app)
        jwt = JWTManager(self.app)
        self.client = self.app.test_client
    def test_usuario_tiene_cancion(self):
        result = self.client().get('/usuario/1/canciones/', headers={"Content-Type": "application/json"})
        self.assertEqual(result.status_code, 404)