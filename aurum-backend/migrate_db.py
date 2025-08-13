#!/usr/bin/env python3
"""
Script de migração para adicionar campos email e client_id à tabela users
"""

import sqlite3
import os
from datetime import datetime

def migrate_database():
    db_path = 'src/database/app.db'
    
    if not os.path.exists(db_path):
        print("Banco de dados não encontrado. Execute init_db.py primeiro.")
        return
    
    # Backup do banco atual
    backup_path = f'src/database/app_backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}.db'
    
    try:
        # Criar backup
        print("Criando backup do banco de dados...")
        import shutil
        shutil.copy2(db_path, backup_path)
        print(f"Backup criado: {backup_path}")
        
        # Conectar ao banco
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Verificar se as colunas já existem
        cursor.execute("PRAGMA table_info(user)")
        columns = [column[1] for column in cursor.fetchall()]
        
        migrations_needed = []
        
        if 'email' not in columns:
            migrations_needed.append('email')
        
        if 'client_id' not in columns:
            migrations_needed.append('client_id')
        
        if not migrations_needed:
            print("Banco de dados já está atualizado!")
            conn.close()
            return
        
        print(f"Aplicando migrações: {', '.join(migrations_needed)}")
        
        # Adicionar coluna email se não existir
        if 'email' in migrations_needed:
            print("Adicionando coluna 'email'...")
            cursor.execute("ALTER TABLE user ADD COLUMN email VARCHAR(120)")
            
            # Atualizar usuários existentes com emails temporários baseados no username
            cursor.execute("SELECT id, username FROM user")
            users = cursor.fetchall()
            
            for user_id, username in users:
                temp_email = f"{username.lower().replace(' ', '.')}@aurum.com"
                cursor.execute("UPDATE user SET email = ? WHERE id = ?", (temp_email, user_id))
            
            print("Emails temporários adicionados aos usuários existentes")
        
        # Adicionar coluna client_id se não existir
        if 'client_id' in migrations_needed:
            print("Adicionando coluna 'client_id'...")
            cursor.execute("ALTER TABLE user ADD COLUMN client_id INTEGER")
            cursor.execute("CREATE INDEX IF NOT EXISTS ix_user_client_id ON user (client_id)")
        
        # Remover constraint UNIQUE do username se existir
        print("Atualizando constraints...")
        
        # Como SQLite não suporta DROP CONSTRAINT, precisamos recriar a tabela
        cursor.execute("""
            CREATE TABLE user_new (
                id INTEGER PRIMARY KEY,
                username VARCHAR(80) NOT NULL,
                email VARCHAR(120) UNIQUE NOT NULL,
                password_hash VARCHAR(128) NOT NULL,
                profile VARCHAR(50) NOT NULL DEFAULT 'usuario',
                client_id INTEGER,
                FOREIGN KEY (client_id) REFERENCES clients(id)
            )
        """)
        
        # Copiar dados da tabela antiga para a nova
        cursor.execute("""
            INSERT INTO user_new (id, username, email, password_hash, profile, client_id)
            SELECT id, username, email, password_hash, profile, client_id FROM user
        """)
        
        # Remover tabela antiga e renomear a nova
        cursor.execute("DROP TABLE user")
        cursor.execute("ALTER TABLE user_new RENAME TO user")
        
        # Commit das mudanças
        conn.commit()
        print("Migração concluída com sucesso!")
        
        # Verificar a estrutura final
        cursor.execute("PRAGMA table_info(user)")
        columns = cursor.fetchall()
        print("\nEstrutura final da tabela 'user':")
        for column in columns:
            print(f"  - {column[1]} ({column[2]})")
        
        conn.close()
        
    except Exception as e:
        print(f"Erro durante a migração: {e}")
        print(f"Restaure o backup se necessário: {backup_path}")
        if 'conn' in locals():
            conn.rollback()
            conn.close()

if __name__ == '__main__':
    print("=== Script de Migração do Banco de Dados ===")
    print("Este script irá:")
    print("1. Criar um backup do banco atual")
    print("2. Adicionar campos 'email' e 'client_id' à tabela users")
    print("3. Atualizar constraints da tabela")
    print()
    
    response = input("Deseja continuar? (s/N): ").lower().strip()
    if response in ['s', 'sim', 'y', 'yes']:
        migrate_database()
    else:
        print("Migração cancelada.")
