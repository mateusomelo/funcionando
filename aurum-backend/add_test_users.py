from src.main import app
from src.models.auth import db, User

with app.app_context():
    # Usuários de teste
    users_data = [
        {"username": "admin.sistema", "email": "admin@aurum.com", "password": "admin123", "profile": "administrador"},
        {"username": "joao.silva", "email": "joao@aurum.com", "password": "tecnico123", "profile": "tecnico"},
        {"username": "maria.santos", "email": "maria@aurum.com", "password": "usuario123", "profile": "usuario"}
    ]

    for user_data in users_data:
        user = User.query.filter_by(username=user_data["username"]).first()
        if not user:
            new_user = User(
                username=user_data["username"], 
                email=user_data["email"], 
                profile=user_data["profile"]
            )
            new_user.set_password(user_data["password"])
            db.session.add(new_user)
            print(f"Usuário {user_data['username']} adicionado.")
        else:
            print(f"Usuário {user_data['username']} já existe.")
    db.session.commit()


