# CLAUDE.md

Este arquivo fornece orientação ao Claude Code (claude.ai/code) ao trabalhar com código neste repositório.

## Visão Geral do Projeto

Este é um sistema de gerenciamento de serviços de TI da Aurum construído com Flask (backend Python) e frontend vanilla HTML/CSS/JavaScript. A aplicação gerencia tickets de serviços de TI, clientes, usuários e tipos de serviços.

## Comandos de Desenvolvimento

### Executando a Aplicação
```bash
cd aurum-backend
python src/main.py
```
O servidor roda em `http://localhost:8289` com modo debug habilitado.

### Gerenciamento do Banco de Dados
```bash
cd aurum-backend
python init_db.py
```
Este script inicializa o banco de dados SQLite e cria usuários padrão se não existirem.

### Configuração do Ambiente
```bash
cd aurum-backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
```

## Arquitetura

### Estrutura do Backend
- **Aplicação Flask**: Ponto de entrada em `src/main.py`
- **Modelos**: Modelos SQLAlchemy em `src/models/` (User, Client, ServiceType, Ticket, TicketResponse)
- **Rotas**: Endpoints da API em `src/routes/` com blueprints para diferentes recursos
- **Banco de Dados**: Banco SQLite em `src/database/app.db`
- **Arquivos Estáticos**: Assets do frontend servidos de `src/static/`

### Modelos do Banco de Dados
- **User**: Autenticação com bcrypt, suporta perfis (administrador, tecnico, usuario)
- **Ticket**: Solicitações de serviços de TI com rastreamento de status e atribuições de usuário
- **Client**: Gerenciamento de informações de clientes
- **ServiceType**: Categorização dos serviços de TI oferecidos
- **TicketResponse**: Respostas/atualizações para tickets

### Autenticação
- Autenticação baseada em sessões usando Flask sessions
- Login aceita tanto username quanto email
- Hash de senhas com bcrypt
- Três perfis de usuário: administrador, tecnico, usuario

### Estrutura da API
Todos os endpoints da API são prefixados com `/api`:
- `/api/auth/*` - Endpoints de autenticação
- `/api/tickets/*` - Gerenciamento de tickets
- `/api/users/*` - Gerenciamento de usuários
- `/api/clients/*` - Gerenciamento de clientes
- `/api/service_types/*` - Gerenciamento de tipos de serviços

### Frontend
- Aplicação de página única servida de `src/static/`
- JavaScript vanilla com componentes modulares
- Formulários para operações CRUD em `src/static/forms/`
- CSS organizado em `src/static/styles/`

## Usuários Padrão
O sistema cria estes usuários padrão na primeira execução:
- admin.sistema / admin123 (administrador)
- joao.silva / tecnico123 (tecnico)
- maria.santos / usuario123 (usuario)

## Arquivos Principais
- `src/main.py`: Configuração e setup da aplicação Flask
- `src/models/user.py`: Instância do banco de dados e modelo User
- `src/routes/auth.py`: Endpoints de autenticação
- `init_db.py`: Script de inicialização do banco de dados
- `requirements.txt`: Dependências Python