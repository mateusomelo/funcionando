from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.email_config import EmailConfig

email_config_bp = Blueprint('email_config', __name__)

@email_config_bp.route('/email-config', methods=['GET'])
def get_email_config():
    """Obter configuração de e-mail ativa"""
    config = EmailConfig.query.filter_by(is_active=True).first()
    if config:
        return jsonify(config.to_dict()), 200
    return jsonify({'message': 'Nenhuma configuração de e-mail encontrada'}), 404

@email_config_bp.route('/email-config', methods=['POST'])
def create_email_config():
    """Criar nova configuração de e-mail"""
    data = request.get_json()
    
    required_fields = ['mail_server', 'mail_username', 'mail_password', 'mail_default_sender', 'recipient_email']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'Campo {field} é obrigatório'}), 400
    
    # Desativar configurações anteriores
    EmailConfig.query.update({'is_active': False})
    
    # Criar nova configuração
    config = EmailConfig(
        mail_server=data[''],
        mail_port=data.get('mail_port', 465),
        mail_use_tls=data.get('mail_use_tls', True),
        mail_username=data['mail_username'],
        mail_password=data['mail_password'],
        mail_default_sender=data['mail_default_sender'],
        recipient_email=data['recipient_email'],
        is_active=True
    )
    
    db.session.add(config)
    db.session.commit()
    
    return jsonify({'message': 'Configuração de e-mail criada com sucesso', 'config': config.to_dict()}), 201

@email_config_bp.route('/email-config/<int:config_id>', methods=['PUT'])
def update_email_config(config_id):
    """Atualizar configuração de e-mail"""
    config = EmailConfig.query.get_or_404(config_id)
    data = request.get_json()
    
    # Atualizar campos se fornecidos
    if 'mail_server' in data:
        config.mail_server = data['mail_server']
    if 'mail_port' in data:
        config.mail_port = data['mail_port']
    if 'mail_use_tls' in data:
        config.mail_use_tls = data['mail_use_tls']
    if 'mail_username' in data:
        config.mail_username = data['mail_username']
    if 'mail_password' in data:
        config.mail_password = data['mail_password']
    if 'mail_default_sender' in data:
        config.mail_default_sender = data['mail_default_sender']
    if 'recipient_email' in data:
        config.recipient_email = data['recipient_email']
    
    db.session.commit()
    
    return jsonify({'message': 'Configuração atualizada com sucesso', 'config': config.to_dict()}), 200

@email_config_bp.route('/email-config/<int:config_id>', methods=['DELETE'])
def delete_email_config(config_id):
    """Deletar configuração de e-mail"""
    config = EmailConfig.query.get_or_404(config_id)
    db.session.delete(config)
    db.session.commit()
    
    return jsonify({'message': 'Configuração deletada com sucesso'}), 200

