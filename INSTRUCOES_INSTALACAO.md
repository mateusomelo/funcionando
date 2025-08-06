# Sistema de Chamados - Aurum Soluções Integradas em T.I.

## Descrição do Sistema

Este é um sistema completo de gerenciamento de chamados para a empresa Aurum - Soluções Integradas em T.I. O sistema inclui:

- **Site institucional** com informações da empresa
- **Sistema de login** com diferentes perfis de usuário
- **Dashboard** para visualização de chamados
- **Sistema de abertura de chamados** com formulário detalhado
- **API REST** para gerenciamento de usuários e tickets

## Funcionalidades Implementadas

### 1. Autenticação e Autorização
- Login com usuário (nome.sobrenome) e senha
- 3 perfis de usuário:
  - **Administrador**: Acesso total ao sistema
  - **Técnico**: Pode visualizar e gerenciar todos os chamados
  - **Usuário**: Pode criar e visualizar apenas seus próprios chamados

### 2. Gerenciamento de Chamados
- Criação de chamados com:
  - Título
  - Descrição detalhada
  - Tipo de serviço (Consultoria, Segurança, Desenvolvimento)
  - Prioridade (Baixa, Média, Alta)
- Dashboard com estatísticas
- Listagem de chamados por usuário/perfil

### 3. Interface Moderna
- Design responsivo e profissional
- Tema escuro com cores ciano/azul
- Componentes UI modernos (shadcn/ui)
- Navegação intuitiva

## Usuários de Teste

O sistema vem com 3 usuários pré-cadastrados:

| Usuário | Senha | Perfil |
|---------|-------|--------|
| admin.sistema | admin123 | Administrador |
| joao.silva | tecnico123 | Técnico |
| maria.santos | usuario123 | Usuário |

## Instalação e Configuração

### Pré-requisitos
- Python 3.11+
- pip (gerenciador de pacotes Python)

### Passos de Instalação

1. **Extrair o arquivo ZIP**
   ```bash
   unzip aurum-sistema-completo.zip
   cd aurum-backend
   ```

2. **Criar ambiente virtual**
   ```bash
   python -m venv venv
   ```

3. **Ativar o ambiente virtual**
   
   **Linux/Mac:**
   ```bash
   source venv/bin/activate
   ```
   
   **Windows:**
   ```bash
   venv\Scripts\activate
   ```

4. **Instalar dependências**
   ```bash
   pip install -r requirements.txt
   ```

5. **Executar o sistema**
   ```bash
   python src/main.py
   ```

6. **Acessar o sistema**
   - Abra o navegador e acesse: `http://localhost:5000`
   - Clique no botão "Login" no canto superior direito
   - Use um dos usuários de teste para fazer login

## Estrutura do Projeto

```
aurum-backend/
├── src/
│   ├── main.py              # Arquivo principal do Flask
│   ├── models/
│   │   └── auth.py          # Modelos de usuário e ticket
│   ├── routes/
│   │   ├── auth.py          # Rotas de autenticação
│   │   ├── tickets.py       # Rotas de chamados
│   │   └── user.py          # Rotas de usuário
│   ├── database/
│   │   └── app.db           # Banco de dados SQLite
│   └── static/              # Arquivos do frontend (React build)
├── requirements.txt         # Dependências Python
└── venv/                   # Ambiente virtual (será criado)
```

## API Endpoints

### Autenticação
- `POST /api/login` - Fazer login
- `POST /api/logout` - Fazer logout
- `GET /api/me` - Obter usuário atual
- `POST /api/register` - Registrar novo usuário

### Chamados
- `GET /api/tickets` - Listar chamados
- `POST /api/tickets` - Criar novo chamado
- `PUT /api/tickets/<id>` - Atualizar chamado
- `DELETE /api/tickets/<id>` - Deletar chamado
- `GET /api/tickets/stats` - Estatísticas de chamados

## Tecnologias Utilizadas

### Backend
- **Flask** - Framework web Python
- **SQLAlchemy** - ORM para banco de dados
- **SQLite** - Banco de dados
- **bcrypt** - Criptografia de senhas
- **Flask-CORS** - Suporte a CORS

### Frontend
- **React** - Biblioteca JavaScript
- **React Router** - Roteamento
- **Tailwind CSS** - Framework CSS
- **shadcn/ui** - Componentes UI
- **Lucide React** - Ícones

## Suporte e Manutenção

### Logs
Os logs do sistema são exibidos no terminal onde o Flask está executando.

### Backup do Banco de Dados
O banco de dados SQLite está localizado em `src/database/app.db`. Faça backup regular deste arquivo.

### Adicionando Novos Usuários
Novos usuários podem ser adicionados através da API `/api/register` ou diretamente no banco de dados.

## Próximos Passos (Melhorias Futuras)

1. **Notificações por email** quando chamados são criados/atualizados
2. **Sistema de comentários** nos chamados
3. **Upload de arquivos** nos chamados
4. **Relatórios avançados** com gráficos
5. **Integração com sistemas externos**
6. **App mobile** para acesso móvel

---

**Desenvolvido para Aurum - Soluções Integradas em T.I.**

