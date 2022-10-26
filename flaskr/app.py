from flaskr import create_app
from flask_jwt_extended import JWTManager
from flask_cors import CORS

app = create_app('production')
cors = CORS(app)
jwt = JWTManager(app)
