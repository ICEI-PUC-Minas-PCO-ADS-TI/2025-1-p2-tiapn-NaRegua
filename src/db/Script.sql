-- Script completo com a nova tabela PRODUTOS e itens de exemplo.

CREATE DATABASE IF NOT EXISTS bncjzdu8swnlmwhhwnp1;
USE bncjzdu8swnlmwhhwnp1;

-- Tabela de Usuários
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

-- Tabela de Barbeiros
CREATE TABLE IF NOT EXISTS barbeiros (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
);

-- Tabela de Serviços
CREATE TABLE IF NOT EXISTS servicos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    duracao_minutos INT UNSIGNED NOT NULL,
    preco DECIMAL(10, 2) NULL
);

-- Tabela de Agendamentos
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

-- ==================================================
-- NOVA TABELA DE PRODUTOS
-- ==================================================
CREATE TABLE IF NOT EXISTS produtos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
    estoque INT UNSIGNED DEFAULT 0,
    imagem_url VARCHAR(1024), -- Para armazenar o link da imagem
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ==================================================
-- INSERÇÃO DE DADOS INICIAIS
-- ==================================================

-- Usuário Admin Padrão
INSERT IGNORE INTO usuarios (nome, cpf, email, senha_hash, is_admin) VALUES
('Admin NaRégua', '00000000000', 'admin@naregua.com', '$2a$10$Sg6y.d2qC1z5a.iN5.hM9u1Fh/D.G1J2k.l4O.p6q7r.B.u8V.w9W', TRUE);

-- Barbeiro de Exemplo
INSERT IGNORE INTO barbeiros (nome) VALUES ('Lucas');

-- Serviços de Exemplo
-- (Vários INSERT IGNORE para serviços aqui... mantidos como antes)
INSERT INTO servicos (nome, duracao_minutos, preco) SELECT 'Corte Masculino Moderno', 45, 50.00 WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE nome = 'Corte Masculino Moderno');
INSERT INTO servicos (nome, duracao_minutos, preco) SELECT 'Barba Desenhada com Navalha', 30, 35.00 WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE nome = 'Barba Desenhada com Navalha');
INSERT INTO servicos (nome, duracao_minutos, preco) SELECT 'Barboterapia Completa (Toalha Quente e Massagem)', 40, 60.00 WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE nome = 'Barboterapia Completa (Toalha Quente e Massagem)');

-- ==================================================
-- NOVOS PRODUTOS DE EXEMPLO
-- ==================================================
INSERT IGNORE INTO produtos (nome, descricao, preco, estoque, imagem_url) VALUES
('Gel Fixador Men Essence', 'O Gel Fixador Men Essence Fixação Megaforte garante 24h de controle do penteado, sem ressecar os fios.', 19.90, 15, 'https://i.imgur.com/LPluS2s.png'),
('Pomada Modeladora Efeito Matte', 'Ideal para estilizar o cabelo com acabamento fosco e natural. Alta fixação e fácil remoção.', 25.50, 20, 'https://i.imgur.com/IsS54m8.png'),
('Shampoo Anticaspa Force', 'Tratamento eficaz contra a caspa, com sensação de frescor e limpeza profunda.', 22.00, 30, 'https://i.imgur.com/x4sL7fB.png'),
('Óleo para Barba Hidratante', 'Hidrata, amacia e dá brilho à barba, com uma fragrância amadeirada suave.', 35.00, 12, 'https://i.imgur.com/pQUmD2B.png');

UPDATE usuarios 
SET senha_hash = '$2b$10$g9pxUF0H5JzhUvYJr.f2u.e7V3jbDT2yWGXz5c05KexoNPAGWwgOG'
WHERE email = 'admin@naregua.com';

UPDATE usuarios 
SET nome = 'Admin'
WHERE email = 'admin@naregua.com';