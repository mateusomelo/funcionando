from flask import Blueprint, request, jsonify, current_app
from flask_mail import Message, Mail
from src.models.email_config import EmailConfig

contact_bp = Blueprint('contact', __name__)
mail = Mail()

@contact_bp.route('/contact', methods=['POST'])
def contact():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')

    if not name or not email or not message:
        return jsonify({'error': 'Todos os campos são obrigatórios.'}), 400

    # Buscar configuração de e-mail ativa
    email_config = EmailConfig.query.filter_by(is_active=True).first()
    if not email_config:
        return jsonify({'error': 'Configuração de e-mail não encontrada. Configure o sistema de e-mail primeiro.'}), 500

    # Configurar Flask-Mail dinamicamente
    current_app.config['MAIL_SERVER'] = email_config.mail_server
    current_app.config['MAIL_PORT'] = email_config.mail_port
    current_app.config['MAIL_USE_TLS'] = email_config.mail_use_tls
    current_app.config['MAIL_USERNAME'] = email_config.mail_username
    current_app.config['MAIL_PASSWORD'] = email_config.mail_password
    current_app.config['MAIL_DEFAULT_SENDER'] = email_config.mail_default_sender

    # Criar mensagem
    msg = Message(
        subject='Nova Mensagem de Contato',
        sender=email_config.mail_default_sender,
        recipients=[email_config.recipient_email]
    )
    msg.body = f'''Nova mensagem de contato recebida:

Nome: {name}
E-mail: {email}
Mensagem: {message}

---
Esta mensagem foi enviada automaticamente pelo sistema de contato.'''

    try:
        mail.send(msg)
        return jsonify({'message': 'Mensagem enviada com sucesso!'}), 200
    except Exception as e:
        return jsonify({'error': f'Erro ao enviar e-mail: {str(e)}'}), 500


