import os
import sys
# DON\'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.user import db, User, bcrypt
from src.models.client import Client
from src.models.service_type import ServiceType
from src.models.ticket import Ticket
from src.models.ticket_response import TicketResponse
from src.routes.user import user_bp
from src.routes.auth import auth_bp
from src.routes.tickets import tickets_bp
from src.routes.users import users_bp
from src.routes.clients import clients_bp
from src.routes.service_types import service_types_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# Habilita CORS para todas as rotas
CORS(app, supports_credentials=True)

# Inicializa o bcrypt
bcrypt.init_app(app)

app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(tickets_bp, url_prefix='/api')
app.register_blueprint(users_bp, url_prefix='/api')
app.register_blueprint(clients_bp, url_prefix='/api')
app.register_blueprint(service_types_bp, url_prefix='/api')

# uncomment if you need to use database
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
with app.app_context():
    db.create_all()
    
    # Cria usuários padrão se não existirem
    if User.query.count() == 0:
        admin = User(username='admin.sistema', email='admin@aurum.com', profile='administrador')
        admin.set_password('admin123')
        
        tecnico = User(username='joao.silva', email='joao@aurum.com', profile='tecnico')
        tecnico.set_password('tecnico123')
        
        usuario = User(username='maria.santos', email='maria@aurum.com', profile='usuario')
        usuario.set_password('usuario123')
        
        db.session.add(admin)
        db.session.add(tecnico)
        db.session.add(usuario)
        db.session.commit()
    
    # Cria tipos de serviço padrão se não existirem
    if ServiceType.query.count() == 0:
        consultoria = ServiceType(name='Consultoria em T.I.', description='Consultoria especializada em tecnologia da informação')
        seguranca = ServiceType(name='Segurança da Informação', description='Serviços de segurança e proteção de dados')
        desenvolvimento = ServiceType(name='Desenvolvimento de Software', description='Desenvolvimento de aplicações e sistemas')
        
        db.session.add(consultoria)
        db.session.add(seguranca)
        db.session.add(desenvolvimento)
        db.session.commit()
    
    # Cria clientes padrão se não existirem
    if Client.query.count() == 0:
        cliente1 = Client(name='TechCorp Ltda', email='contato@techcorp.com', phone='(11) 9999-9999', company='TechCorp')
        cliente2 = Client(name='InovaLabs', email='info@inovalabs.com', phone='(11) 8888-8888', company='InovaLabs')
        cliente3 = Client(name='DataGuard Solutions', email='suporte@dataguard.com', phone='(11) 7777-7777', company='DataGuard')
        
        db.session.add(cliente1)
        db.session.add(cliente2)
        db.session.add(cliente3)
        db.session.commit()

@app.route('/forms/<path:filename>')
def serve_forms(filename):
    """Serve form files"""
    return send_from_directory('static/forms', filename)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8289, debug=True)



