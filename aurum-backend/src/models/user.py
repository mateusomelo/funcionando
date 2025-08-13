from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)  # Nome para exibição
    email = db.Column(db.String(120), unique=True, nullable=False)  # Email para login
    password_hash = db.Column(db.String(128), nullable=False)
    profile = db.Column(db.String(50), nullable=False, default='usuario')
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'), nullable=True)
    
    # Relacionamento com Client
    client = db.relationship('Client', backref='users')

    def __repr__(self):
        return f'<User {self.username} ({self.email})>'

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'profile': self.profile,
            'client_id': self.client_id,
            'client_name': self.client.name if self.client else None
        }

