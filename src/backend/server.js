// src/backend/server.js
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração da conexão com o MySQL
const dbConfig = {
    host: 'localhost',
    user: 'root',           // SEU USUÁRIO MYSQL
    password: '713368',  // SUA SENHA MYSQL
    database: 'nareguabanco'  // SEU BANCO DE DADOS (ex: nareguabanco ou naregua_db)
};

// Chave secreta para JWT - MUDE E GUARDE EM LOCAL SEGURO (variável de ambiente em produção)
const JWT_SECRET = 'SEU_SEGREDO_SUPER_SECRETO_PARA_JWT_AQUI_TROQUE_ISSO';

// --- ROTAS DE AUTENTICAÇÃO E USUÁRIO ---

// REGISTRO DE USUÁRIO (com telefone)
app.post('/api/usuarios/registrar', async (req, res) => {
    const { nome, cpf, email, senha, telefone } = req.body;

    if (!nome || (!cpf && !email) || !senha) {
        return res.status(400).json({ message: 'Nome, (CPF ou Email), e Senha são obrigatórios.' });
    }
    // Adicionar validações mais robustas para CPF, Email e Telefone aqui se desejar

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const cpfLimpo = cpf ? cpf.replace(/\D/g, '') : null;

        let queryVerifica = 'SELECT id FROM usuarios WHERE ';
        const paramsVerifica = [];
        if (cpfLimpo) {
            queryVerifica += 'cpf = ?';
            paramsVerifica.push(cpfLimpo);
        }
        if (email) {
            queryVerifica += (cpfLimpo && paramsVerifica.length > 0 ? ' OR' : '') + ' email = ?';
            paramsVerifica.push(email);
        }

        if (paramsVerifica.length > 0) {
            const [usuariosExistentes] = await connection.execute(queryVerifica, paramsVerifica);
            if (usuariosExistentes.length > 0) {
                return res.status(409).json({ message: 'CPF ou Email já cadastrado.' });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        const [result] = await connection.execute(
            'INSERT INTO usuarios (nome, cpf, email, senha_hash, telefone) VALUES (?, ?, ?, ?, ?)',
            [nome, cpfLimpo, email || null, senhaHash, telefone || null]
        );
        res.status(201).json({ message: 'Usuário registrado com sucesso!', usuarioId: result.insertId });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ message: 'Erro interno ao registrar usuário.', error: error.message });
    } finally {
        if (connection) await connection.end();
    }
});

// LOGIN DE USUÁRIO
app.post('/api/usuarios/login', async (req, res) => {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
        return res.status(400).json({ message: 'Usuário e Senha são obrigatórios.' });
    }

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const cpfLimpoLogin = String(usuario).replace(/\D/g, ''); // Garante que é string antes de replace

        const [rows] = await connection.execute(
            'SELECT id, nome, email, cpf, senha_hash FROM usuarios WHERE email = ? OR cpf = ?',
            [usuario, cpfLimpoLogin]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
        }

        const user = rows[0];
        const senhaValida = await bcrypt.compare(senha, user.senha_hash);

        if (!senhaValida) {
            return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
        }

        const tokenPayload = {
            userId: user.id,
            nome: user.nome,
            email: user.email,
            cpf: user.cpf
        };
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '3h' });

        res.json({ message: 'Login bem-sucedido!', token: token, userName: user.nome });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno no login.', error: error.message });
    } finally {
        if (connection) await connection.end();
    }
});

// RECUPERAÇÃO DE SENHA
app.post('/api/usuarios/recuperar-senha', async (req, res) => {
    const { CPF, novaSenha } = req.body;

    if (!CPF || !novaSenha) {
        return res.status(400).json({ message: 'CPF e Nova Senha são obrigatórios.' });
    }
    const cpfLimpo = String(CPF).replace(/\D/g, '');

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [usuarios] = await connection.execute('SELECT id FROM usuarios WHERE cpf = ?', [cpfLimpo]);

        if (usuarios.length === 0) {
            return res.status(404).json({ message: 'CPF não encontrado.' });
        }

        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(novaSenha, salt);

        await connection.execute(
            'UPDATE usuarios SET senha_hash = ? WHERE cpf = ?',
            [senhaHash, cpfLimpo]
        );
        res.json({ message: 'Senha alterada com sucesso!' });
    } catch (error) {
        console.error('Erro ao recuperar senha:', error);
        res.status(500).json({ message: 'Erro interno ao recuperar senha.', error: error.message });
    } finally {
        if (connection) await connection.end();
    }
});

// --- MIDDLEWARE DE AUTENTICAÇÃO ---
const autenticarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, userPayload) => {
        if (err) return res.sendStatus(403);
        req.user = userPayload;
        next();
    });
};

// --- ROTAS DE AGENDAMENTO (Protegidas e Públicas) ---

// Rota para buscar todos os barbeiros (PÚBLICA)
app.get('/api/barbeiros', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT id, nome FROM barbeiros');
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar barbeiros:', error);
        res.status(500).json({ message: 'Erro ao buscar barbeiros', error: error.message });
    } finally {
        if (connection) await connection.end();
    }
});

// Rota para buscar todos os serviços (PÚBLICA)
app.get('/api/servicos', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT id, nome, duracao_minutos FROM servicos');
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar servicos:', error);
        res.status(500).json({ message: 'Erro ao buscar servicos', error: error.message });
    } finally {
        if (connection) await connection.end();
    }
});

// Rota para buscar horários disponíveis (PÚBLICA)
app.get('/api/horarios-disponiveis', async (req, res) => {
    const { barbeiroId, data, servicoId } = req.query;
    if (!barbeiroId || !data || !servicoId) {
        return res.status(400).json({ message: 'Parâmetros barbeiroId, data e servicoId são obrigatórios.' });
    }
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [servicoRows] = await connection.execute('SELECT duracao_minutos FROM servicos WHERE id = ?', [servicoId]);
        if (servicoRows.length === 0) {
            return res.status(404).json({ message: 'Serviço não encontrado.' });
        }
        // Lógica SIMPLIFICADA para horários (refinar conforme necessidade)
        const [agendamentos] = await connection.execute(
            'SELECT hora_agendamento FROM agendamentos WHERE barbeiro_id = ? AND data_agendamento = ?',
            [barbeiroId, data]
        );
        const horariosPadrao = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
        const horariosOcupados = agendamentos.map(ag => ag.hora_agendamento.substring(0, 5));
        const horariosDisponiveis = horariosPadrao.filter(h => !horariosOcupados.includes(h));
        res.json(horariosDisponiveis);
    } catch (error) {
        console.error('Erro ao buscar horários:', error);
        res.status(500).json({ message: 'Erro ao buscar horários disponíveis', error: error.message });
    } finally {
        if (connection) await connection.end();
    }
});

// Rota para CRIAR um novo agendamento (PROTEGIDA e ATUALIZADA com nome/telefone do cliente)
app.post('/api/agendamentos', autenticarToken, async (req, res) => {
    const { barbeiroId, servicoId, data, horario } = req.body;
    const usuarioId = req.user.userId;

    if (!barbeiroId || !servicoId || !data || !horario) {
        return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
    }

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        // 1. Buscar nome e telefone do usuário logado
        const [usuarios] = await connection.execute(
            'SELECT nome, telefone FROM usuarios WHERE id = ?',
            [usuarioId]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({ message: 'Usuário autenticado não encontrado no banco de dados.' });
        }
        const nomeClienteLogado = usuarios[0].nome;
        const telefoneClienteLogado = usuarios[0].telefone;

        // 2. Inserir o agendamento com os dados do cliente
        const [result] = await connection.execute(
            'INSERT INTO agendamentos (barbeiro_id, servico_id, data_agendamento, hora_agendamento, usuario_id, nome_cliente, telefone_cliente) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [barbeiroId, servicoId, data, horario, usuarioId, nomeClienteLogado, telefoneClienteLogado]
        );

        res.status(201).json({ message: 'Agendamento criado com sucesso!', agendamentoId: result.insertId });
    } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        if (error.code === 'ER_DUP_ENTRY') { // Se houver constraint de unicidade
            return res.status(409).json({ message: 'Conflito: Este horário pode já estar agendado ou dados duplicados.' });
        }
        res.status(500).json({ message: 'Erro ao criar agendamento', error: error.message });
    } finally {
        if (connection) await connection.end();
    }
});

// --- INICIAR SERVIDOR ---
app.listen(port, () => {
    console.log(`Servidor backend rodando em http://localhost:${port}`);
    mysql.createConnection(dbConfig)
        .then(conn => {
            console.log('Conexão com o MySQL bem-sucedida ao iniciar o servidor!');
            conn.end();
        })
        .catch(err => console.error('Falha ao conectar com o MySQL ao iniciar o servidor:', err.message));
});