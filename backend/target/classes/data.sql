-- Script para criar e popular o banco Kanban

-- Criar banco de dados (caso não exista)
CREATE DATABASE IF NOT EXISTS kanban_db;
USE kanban_db;

-- Inserir colunas padrão
INSERT IGNORE INTO columns (column_id, title, display_order, created_at, updated_at) VALUES
('todo', 'A Fazer', 1, NOW(), NOW()),
('doing', 'Em Progresso', 2, NOW(), NOW()),
('done', 'Concluído', 3, NOW(), NOW());

-- Inserir dados de exemplo (serão executados automaticamente pelo Spring Boot)
INSERT INTO tasks (title, description, assignee, priority, status, due_date, created_at, updated_at) VALUES
('Configurar ambiente de desenvolvimento', 'Instalar e configurar todas as ferramentas necessárias para o projeto', 'João Silva', 'ALTA', 'DONE', '2025-08-25', NOW(), NOW()),
('Criar API de usuários', 'Desenvolver endpoints para cadastro, login e gestão de usuários', 'Maria Santos', 'ALTA', 'DOING', '2025-08-30', NOW(), NOW()),
('Implementar autenticação JWT', 'Adicionar sistema de autenticação com tokens JWT', 'Pedro Costa', 'MEDIA', 'TODO', '2025-09-05', NOW(), NOW()),
('Design da interface', 'Criar protótipos e mockups das telas principais', 'Ana Lima', 'MEDIA', 'DOING', '2025-08-28', NOW(), NOW()),
('Testes unitários', 'Escrever testes para todas as funcionalidades críticas', 'Carlos Oliveira', 'BAIXA', 'TODO', '2025-09-10', NOW(), NOW()),
('Documentação técnica', 'Documentar arquitetura e APIs do sistema', 'Lucia Ferreira', 'BAIXA', 'TODO', '2025-09-15', NOW(), NOW()),
('Deploy em produção', 'Configurar ambiente de produção e fazer deploy', 'Roberto Alves', 'ALTA', 'TODO', '2025-09-20', NOW(), NOW());

-- Consultas úteis para verificar os dados
-- SELECT * FROM tasks;
-- SELECT * FROM columns ORDER BY display_order;
-- SELECT status, COUNT(*) as quantidade FROM tasks GROUP BY status;
-- SELECT priority, COUNT(*) as quantidade FROM tasks GROUP BY priority;
