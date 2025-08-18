from flask import Blueprint, request, jsonify, session, send_file
from src.models.user import db, User
from src.models.ticket import Ticket
from src.models.client import Client
from src.models.service_type import ServiceType
from src.models.ticket_file import TicketFile
from flask_cors import cross_origin
from datetime import datetime
from werkzeug.utils import secure_filename
import os
import uuid
from pathlib import Path

tickets_bp = Blueprint("tickets", __name__)

# Configurações de upload
UPLOAD_FOLDER = 'uploads/tickets'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'rar'}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB

def require_auth():
    """Decorator para verificar autenticação"""
    if 'user_id' not in session:
        return jsonify({'error': 'Usuário não autenticado'}), 401
    return None

def allowed_file(filename):
    """Verifica se o arquivo é permitido"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_user_permissions(user_id):
    """Retorna as permissões do usuário baseado no perfil"""
    user = User.query.get(user_id)
    if not user:
        return None
    
    return {
        'user': user,
        'is_admin': user.profile == 'administrador',
        'is_tech': user.profile in ['administrador', 'tecnico'],
        'can_view_all': user.profile in ['administrador', 'tecnico'],
        'can_view_company': user.is_responsible,
        'company_id': user.company_id
    }

@tickets_bp.route('/tickets', methods=['GET'])
@cross_origin()
def get_tickets():
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    try:
        user_id = session['user_id']
        permissions = get_user_permissions(user_id)
        
        if not permissions:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        # Administradores e técnicos veem todos os tickets
        if permissions['can_view_all']:
            tickets = Ticket.query.all()
        # Usuário responsável vê tickets da sua empresa
        elif permissions['can_view_company'] and permissions['company_id']:
            tickets = Ticket.query.filter_by(company_id=permissions['company_id']).all()
        # Usuário comum vê apenas seus próprios tickets
        else:
            tickets = Ticket.query.filter_by(user_id=user_id).all()
        
        return jsonify({
            'tickets': [ticket.to_dict() for ticket in tickets]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tickets_bp.route('/tickets', methods=['POST'])
@cross_origin()
def create_ticket():
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    try:
        user_id = session['user_id']
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        # Pega dados do formulário (multipart/form-data para upload)
        title = request.form.get('title')
        description = request.form.get('description')
        service_type_id = request.form.get('service_type_id')
        priority = request.form.get('priority', 'media')
        
        # Validações básicas
        if not title or not description or not service_type_id:
            return jsonify({'error': 'Título, descrição e tipo de serviço são obrigatórios'}), 400
        
        # Valida tipo de serviço
        service_type = ServiceType.query.get(service_type_id)
        if not service_type:
            return jsonify({'error': 'Tipo de serviço inválido'}), 400
        
        # Valida prioridade
        if priority not in ['baixa', 'media', 'alta', 'urgente']:
            return jsonify({'error': 'Prioridade inválida'}), 400
        
        # Para usuários comuns, usar a empresa do usuário
        # Para admins/técnicos, permitir especificar empresa
        if user.profile == 'usuario':
            if not user.company_id:
                return jsonify({'error': 'Usuário deve estar vinculado a uma empresa'}), 400
            company_id = user.company_id
        else:
            company_id = request.form.get('company_id') or user.company_id
            if not company_id:
                return jsonify({'error': 'Empresa é obrigatória'}), 400
        
        # Cria o ticket
        ticket = Ticket(
            title=title,
            description=description,
            service_type=service_type.name,
            priority=priority,
            user_id=user_id,
            company_id=company_id
        )
        
        db.session.add(ticket)
        db.session.flush()  # Para obter o ID do ticket
        
        # Processa arquivos se enviados
        uploaded_files = []
        if 'files' in request.files:
            files = request.files.getlist('files')
            for file in files:
                if file and file.filename and allowed_file(file.filename):
                    # Cria diretório se não existe
                    upload_path = Path(UPLOAD_FOLDER)
                    upload_path.mkdir(parents=True, exist_ok=True)
                    
                    # Gera nome único para o arquivo
                    file_extension = file.filename.rsplit('.', 1)[1].lower()
                    unique_filename = f"{uuid.uuid4()}.{file_extension}"
                    file_path = upload_path / unique_filename
                    
                    # Salva o arquivo
                    file.save(str(file_path))
                    
                    # Cria registro no banco
                    ticket_file = TicketFile(
                        ticket_id=ticket.id,
                        filename=unique_filename,
                        original_filename=secure_filename(file.filename),
                        file_path=str(file_path),
                        file_size=os.path.getsize(str(file_path)),
                        file_type=file.content_type or 'application/octet-stream',
                        uploaded_by=user_id
                    )
                    
                    db.session.add(ticket_file)
                    uploaded_files.append(ticket_file.to_dict())
        
        db.session.commit()
        
        response_data = ticket.to_dict()
        response_data['uploaded_files'] = uploaded_files
        
        return jsonify({
            'message': 'Chamado criado com sucesso',
            'ticket': response_data
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@tickets_bp.route("/tickets/<int:ticket_id>", methods=["GET"])
@cross_origin()
def get_ticket_by_id(ticket_id):
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    try:
        ticket = Ticket.query.get_or_404(ticket_id)
        user_id = session["user_id"]
        permissions = get_user_permissions(user_id)
        
        if not permissions:
            return jsonify({"error": "Usuário não encontrado"}), 404
        
        # Verifica permissões de visualização
        can_view = False
        
        if permissions['can_view_all']:
            can_view = True
        elif permissions['can_view_company'] and ticket.company_id == permissions['company_id']:
            can_view = True
        elif ticket.user_id == user_id:
            can_view = True
        
        if not can_view:
            return jsonify({"error": "Sem permissão para ver este chamado"}), 403
        
        return jsonify({"ticket": ticket.to_dict()}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@tickets_bp.route('/tickets/<int:ticket_id>/files/<int:file_id>/download', methods=['GET'])
@cross_origin()
def download_file(ticket_id, file_id):
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    try:
        ticket = Ticket.query.get_or_404(ticket_id)
        ticket_file = TicketFile.query.get_or_404(file_id)
        
        if ticket_file.ticket_id != ticket_id:
            return jsonify({'error': 'Arquivo não pertence a este ticket'}), 400
        
        user_id = session["user_id"]
        permissions = get_user_permissions(user_id)
        
        # Verifica permissões (mesmas regras de visualização de ticket)
        can_view = False
        
        if permissions['can_view_all']:
            can_view = True
        elif permissions['can_view_company'] and ticket.company_id == permissions['company_id']:
            can_view = True
        elif ticket.user_id == user_id:
            can_view = True
        
        if not can_view:
            return jsonify({"error": "Sem permissão para baixar este arquivo"}), 403
        
        # Verifica se arquivo existe
        if not os.path.exists(ticket_file.file_path):
            return jsonify({'error': 'Arquivo não encontrado no servidor'}), 404
        
        return send_file(
            ticket_file.file_path,
            as_attachment=True,
            download_name=ticket_file.original_filename
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tickets_bp.route('/tickets/<int:ticket_id>/files', methods=['POST'])
@cross_origin()
def upload_file_to_ticket(ticket_id):
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    try:
        ticket = Ticket.query.get_or_404(ticket_id)
        user_id = session["user_id"]
        permissions = get_user_permissions(user_id)
        
        # Verifica permissões de visualização (quem pode ver pode adicionar arquivos)
        can_upload = False
        
        if permissions['can_view_all']:
            can_upload = True
        elif permissions['can_view_company'] and ticket.company_id == permissions['company_id']:
            can_upload = True
        elif ticket.user_id == user_id:
            can_upload = True
        
        if not can_upload:
            return jsonify({"error": "Sem permissão para adicionar arquivos a este chamado"}), 403
        
        if 'file' not in request.files:
            return jsonify({'error': 'Nenhum arquivo enviado'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'Nenhum arquivo selecionado'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Tipo de arquivo não permitido'}), 400
        
        # Cria diretório se não existe
        upload_path = Path(UPLOAD_FOLDER)
        upload_path.mkdir(parents=True, exist_ok=True)
        
        # Gera nome único para o arquivo
        file_extension = file.filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = upload_path / unique_filename
        
        # Salva o arquivo
        file.save(str(file_path))
        
        # Cria registro no banco
        ticket_file = TicketFile(
            ticket_id=ticket_id,
            filename=unique_filename,
            original_filename=secure_filename(file.filename),
            file_path=str(file_path),
            file_size=os.path.getsize(str(file_path)),
            file_type=file.content_type or 'application/octet-stream',
            uploaded_by=user_id
        )
        
        db.session.add(ticket_file)
        db.session.commit()
        
        return jsonify({
            'message': 'Arquivo enviado com sucesso',
            'file': ticket_file.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@tickets_bp.route('/tickets/stats', methods=['GET'])
@cross_origin()
def get_ticket_stats():
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    try:
        user_id = session['user_id']
        permissions = get_user_permissions(user_id)
        
        # Aplica filtros baseados nas permissões
        if permissions['can_view_all']:
            base_query = Ticket.query
        elif permissions['can_view_company'] and permissions['company_id']:
            base_query = Ticket.query.filter_by(company_id=permissions['company_id'])
        else:
            base_query = Ticket.query.filter_by(user_id=user_id)
        
        total_tickets = base_query.count()
        open_tickets = base_query.filter_by(status='aberto').count()
        in_progress_tickets = base_query.filter_by(status='em_andamento').count()
        closed_tickets = base_query.filter_by(status='fechado').count()
        
        return jsonify({
            'stats': {
                'total': total_tickets,
                'aberto': open_tickets,
                'em_andamento': in_progress_tickets,
                'fechado': closed_tickets
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Resto dos endpoints (update, delete, close, assign) com as mesmas validações de permissão
@tickets_bp.route("/tickets/<int:ticket_id>", methods=["PUT"])
@cross_origin()
def update_ticket(ticket_id):
    auth_error = require_auth()
    if auth_error:
        return auth_error
    
    try:
        ticket = Ticket.query.get_or_404(ticket_id)
        user_id = session['user_id']
        permissions = get_user_permissions(user_id)
        
        # Verifica permissões de edição
        can_edit = False
        
        if permissions['can_view_all']:
            can_edit = True
        elif permissions['can_view_company'] and ticket.company_id == permissions['company_id']:
            can_edit = True
        elif ticket.user_id == user_id:
            can_edit = True
        
        if not can_edit:
            return jsonify({'error': 'Sem permissão para editar este chamado'}), 403
        
        data = request.get_json()
        
        # Campos que podem ser atualizados por todos
        if 'title' in data:
            ticket.title = data['title']
        if 'description' in data:
            ticket.description = data['description']
        if 'priority' in data and data['priority'] in ['baixa', 'media', 'alta', 'urgente']:
            ticket.priority = data['priority']
        
        # Apenas administradores e técnicos podem alterar status e atribuição
        if permissions['is_tech']:
            if 'status' in data and data['status'] in ['aberto', 'em_andamento', 'fechado']:
                ticket.status = data['status']
                if data['status'] == 'fechado':
                    ticket.closed_at = datetime.utcnow()
            if 'assigned_to' in data:
                ticket.assigned_to = data['assigned_to']
            if 'service_type' in data:
                service_type = ServiceType.query.filter_by(name=data['service_type']).first()
                if service_type:
                    ticket.service_type = service_type.name
        
        ticket.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Chamado atualizado com sucesso',
            'ticket': ticket.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500