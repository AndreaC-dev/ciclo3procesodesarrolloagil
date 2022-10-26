import os


class Config(object):
    """Parent configuration class."""
    DEBUG = False
    CSRF_ENABLED = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///tutorial_canciones.db'
    JWT_SECRET_KEY = 'frase-secreta'
    PROPAGATE_EXCEPTIONS = True

class TestingConfig(Config):
    """Configurations for Testing, with a separate test database."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///tutorial_canciones_test.db'
    DEBUG = True

class ProductionConfig(Config):
    """Configurations for Production."""
    DEBUG = False
    TESTING = False

app_config = {
    'testing': TestingConfig,
    'production': ProductionConfig,
}
