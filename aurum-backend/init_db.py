from src.main import app
from src.models.user import db, User

with app.app_context():
    db.create_all()
    
    # Verificar se há usuários no banco
    users = User.query.all()
    print(f"Usuários encontrados: {len(users)}")
    for user in users:
        print(f"  - {user.username} ({user.profile})")
    
    # Se não houver usuários, criar usuários padrão
    if len(users) == 0:
        print("Criando usuários padrão...")
        admin = User(username='admin', email='admin@aurum.com', profile='administrador')
        admin.set_password('admin123')
        
        tecnico = User(username='tecnico', email='tecnico@aurum.com', profile='tecnico')
        tecnico.set_password('tecnico123')
        
        usuario = User(username='usuario', email='usuario@aurum.com', profile='usuario')
        usuario.set_password('usuario123')
        
        db.session.add(admin)
        db.session.add(tecnico)
        db.session.add(usuario)
        db.session.commit()
        print("Usuários padrão criados com sucesso!")


