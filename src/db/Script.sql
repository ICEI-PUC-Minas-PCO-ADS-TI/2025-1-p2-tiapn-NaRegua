-- Script para criar o banco de dados e todas as tabelas, incluindo a funcionalidade de admin e um usuário admin padrão.

-- 1. Criação do Banco de Dados
CREATE DATABASE IF NOT EXISTS nareguabanco
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- 2. Seleção do Banco de Dados
USE nareguabanco;

-- 3. Criação da Tabela de Usuários (com a coluna is_admin)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) NOT NULL,
    email VARCHAR(255) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uc_cpf UNIQUE (cpf),
    CONSTRAINT uc_email UNIQUE (email)
);

-- 4. Criação das outras tabelas
CREATE TABLE IF NOT EXISTS barbeiros (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS servicos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    duracao_minutos INT UNSIGNED NOT NULL,
    preco DECIMAL(10, 2) NULL
);

CREATE TABLE IF NOT EXISTS agendamentos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    barbeiro_id INT UNSIGNED NOT NULL,
    servico_id INT UNSIGNED NOT NULL,
    data_agendamento DATE NOT NULL,
    hora_agendamento TIME NOT NULL,
    nome_cliente VARCHAR(255) NULL,
    telefone_cliente VARCHAR(20) NULL,
    status_agendamento VARCHAR(50) DEFAULT 'Confirmado',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observacoes TEXT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (barbeiro_id) REFERENCES barbeiros(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (servico_id) REFERENCES servicos(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT uc_agendamento_barbeiro_horario UNIQUE (barbeiro_id, data_agendamento, hora_agendamento)
);

-- 5. Inserção de Dados Iniciais

-- Inserção do usuário Administrador Padrão
-- A senha 'admin123' já está criptografada (hashed) por segurança.
INSERT IGNORE INTO usuarios (nome, cpf, email, senha_hash, is_admin) VALUES
('Admin NaRégua', '00000000000', 'admin@naregua.com', '$2a$10$Sg6y.d2qC1z5a.iN5.hM9u1Fh/D.G1J2k.l4O.p6q7r.B.u8V.w9W', TRUE);


-- Inserção de Barbeiros e Serviços de exemplo
INSERT INTO barbeiros (nome)
SELECT 'Lucas'
WHERE NOT EXISTS (SELECT 1 FROM barbeiros WHERE nome = 'Lucas');

INSERT INTO servicos (nome, duracao_minutos, preco)
SELECT 'Corte Masculino Moderno', 45, 50.00
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE nome = 'Corte Masculino Moderno');

INSERT INTO servicos (nome, duracao_minutos, preco)
SELECT 'Barba Desenhada com Navalha', 30, 35.00
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE nome = 'Barba Desenhada com Navalha');

INSERT INTO servicos (nome, duracao_minutos, preco)
SELECT 'Barboterapia Completa (Toalha Quente e Massagem)', 40, 60.00
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE nome = 'Barboterapia Completa (Toalha Quente e Massagem)');

INSERT INTO servicos (nome, duracao_minutos, preco)
SELECT 'Combo Alpha (Corte Moderno + Barboterapia)', 80, 100.00
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE nome = 'Combo Alpha (Corte Moderno + Barboterapia)');

INSERT INTO servicos (nome, duracao_minutos, preco)
SELECT 'Coloração Capilar Masculina', 60, 85.00
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE nome = 'Coloração Capilar Masculina');

INSERT INTO servicos (nome, duracao_minutos, preco)
SELECT 'Hidratação Capilar Premium', 30, 45.00
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE nome = 'Hidratação Capilar Premium');

INSERT INTO servicos (nome, duracao_minutos, preco)
SELECT 'Design de Sobrancelha Masculina', 20, 25.00
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE nome = 'Design de Sobrancelha Masculina');

INSERT INTO servicos (nome, duracao_minutos, preco)
SELECT 'Alisamento/Progressiva Masculina (Curto)', 90, 120.00
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE nome = 'Alisamento/Progressiva Masculina (Curto)');

INSERT INTO servicos (nome, duracao_minutos, preco)
SELECT 'Limpeza de Pele Facial Express', 35, 70.00
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE nome = 'Limpeza de Pele Facial Express');

INSERT INTO servicos (nome, duracao_minutos, preco)
SELECT 'Corte Infantil Estilizado (até 10 anos)', 30, 40.00
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE nome = 'Corte Infantil Estilizado (até 10 anos)');

INSERT INTO servicos (nome, duracao_minutos, preco)
SELECT 'Pezinho (Acabamento)', 15, 20.00
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE nome = 'Pezinho (Acabamento)');

INSERT INTO servicos (nome, duracao_minutos, preco)
SELECT 'Camuflagem de Fios Brancos', 30, 50.00
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE nome = 'Camuflagem de Fios Brancos');