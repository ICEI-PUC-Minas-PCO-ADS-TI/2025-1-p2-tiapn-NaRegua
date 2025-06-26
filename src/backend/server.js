// src/backend/server.js
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares Globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração da conexão com o MySQL
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '713368', // SUA SENHA MYSQL
    database: 'nareguabanco'
};

const JWT_SECRET = 'SEU_SEGREDO_SUPER_SECRETO_PARA_JWT_AQUI_TROQUE_ISSO_IMEDIATAMENTE';

// --- FUNÇÕES AUXILIARES DE DATA/HORA ---
function parseDateTime(dateStr, timeStr) {
    return new Date(`${dateStr}T${timeStr}:00`);
}
function formatTime(dateObj) {
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// --- MIDDLEWARES DE AUTENTICAÇÃO ---
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

const autenticarAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Acesso negado. Recurso exclusivo para administradores.' });
    }
};

// --- ROTAS DE USUÁRIO ---
app.post('/api/usuarios/registrar', async (req, res) => {
    const { nome, cpf, email, senha } = req.body;
    if (!nome || !cpf || !email || !senha) {
        return res.status(400).json({ message: 'Nome, CPF, Email e Senha são obrigatórios.' });
    }
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const cpfLimpo = cpf.replace(/\D/g, '');
        const [usuariosExistentes] = await connection.execute('SELECT id FROM usuarios WHERE cpf = ? OR email = ?', [cpfLimpo, email]);
        if (usuariosExistentes.length > 0) {
            return res.status(409).json({ message: 'CPF ou Email já cadastrado.' });
        }
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);
        await connection.execute('INSERT INTO usuarios (nome, cpf, email, senha_hash) VALUES (?, ?, ?, ?)', [nome, cpfLimpo, email, senhaHash]);
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno ao registrar usuário.', error: error.message });
    } finally {
        if (connection) await connection.end();
    }
});

app.post('/api/usuarios/login', async (req, res) => {
    const { usuario, senha } = req.body;
    if (!usuario || !senha) {
        return res.status(400).json({ message: 'Usuário (CPF/Email) e Senha são obrigatórios.' });
    }
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const cpfLimpoLogin = String(usuario).replace(/\D/g, '');
        const [rows] = await connection.execute('SELECT id, nome, email, cpf, senha_hash, is_admin FROM usuarios WHERE email = ? OR cpf = ?', [usuario, cpfLimpoLogin]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
        }
        const user = rows[0];
        const senhaValida = await bcrypt.compare(senha, user.senha_hash);
        if (!senhaValida) {
            return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
        }
        const tokenPayload = { userId: user.id, nome: user.nome, isAdmin: !!user.is_admin };
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '3h' });
        res.json({ message: 'Login bem-sucedido!', token: token, userName: user.nome, isAdmin: !!user.is_admin });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno no login.', error: error.message });
    } finally {
        if (connection) await connection.end();
    }
});

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
        await connection.execute('UPDATE usuarios SET senha_hash = ? WHERE cpf = ?', [senhaHash, cpfLimpo]);
        res.json({ message: 'Senha alterada com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno ao recuperar senha.', error: error.message });
    } finally {
        if (connection) await connection.end();
    }
});

app.delete('/api/usuarios/minha-conta', autenticarToken, async (req, res) => {
    const usuarioId = req.user.userId;
    if (!usuarioId) {
        return res.status(400).json({ message: 'ID do usuário não encontrado no token.' });
    }
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.beginTransaction();
        const [result] = await connection.execute('DELETE FROM usuarios WHERE id = ?', [usuarioId]);
        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Usuário não encontrado para exclusão.' });
        }
        await connection.commit();
        res.status(200).json({ message: 'Sua conta e todos os dados associados foram excluídos com sucesso.' });
    } catch (error) {
        if (connection) await connection.rollback();
        res.status(500).json({ message: 'Erro interno ao excluir sua conta.', error: error.message });
    } finally {
        if (connection) await connection.end();
    }
});

// --- ROTAS PÚBLICAS (Agendamento e Produtos) ---
app.get('/api/barbeiros', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT id, nome FROM barbeiros ORDER BY nome ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar barbeiros', error: error.message });
    } finally {
        if (connection) await connection.end();
    }
});

app.get('/api/servicos', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT id, nome, duracao_minutos, preco FROM servicos ORDER BY nome ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar servicos', error: error.message });
    } finally {
        if (connection) await connection.end();
    }
});

app.get('/api/horarios-disponiveis', async (req, res) => {
    const { barbeiroId, data, servicoId } = req.query;
    if (!barbeiroId || !data || !servicoId) {
        return res.status(400).json({ message: 'Parâmetros barbeiroId, data e servicoId são obrigatórios.' });
    }
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [servicoEscolhidoRows] = await connection.execute('SELECT duracao_minutos FROM servicos WHERE id = ?', [servicoId]);
        if (servicoEscolhidoRows.length === 0) {
            return res.status(404).json({ message: 'Serviço não encontrado.' });
        }
        const duracaoNovoServico = servicoEscolhidoRows[0].duracao_minutos;
        const [agendamentosExistentes] = await connection.execute(
            `SELECT ag.hora_agendamento, s.duracao_minutos FROM agendamentos ag JOIN servicos s ON ag.servico_id = s.id WHERE ag.barbeiro_id = ? AND ag.data_agendamento = ? AND ag.status_agendamento NOT IN (?, ?, ?, ?)`,
            [barbeiroId, data, 'Cancelado', 'Rejeitado', 'Não Compareceu', 'Finalizado']
        );
        const horariosPadraoIniciais = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"];
        const horarioFimExpediente = "19:00";
        const intervalosOcupados = agendamentosExistentes.map(ag => {
            const inicio = parseDateTime(data, ag.hora_agendamento.substring(0, 5));
            const fim = new Date(inicio.getTime() + ag.duracao_minutos * 60000);
            return { inicio, fim };
        });
        const horariosDisponiveis = [];
        const fimExpedienteDateTime = parseDateTime(data, horarioFimExpediente);
        for (const horarioCandidatoStr of horariosPadraoIniciais) {
            const inicioCandidato = parseDateTime(data, horarioCandidatoStr);
            const fimCandidato = new Date(inicioCandidato.getTime() + duracaoNovoServico * 60000);
            if (fimCandidato > fimExpedienteDateTime) { continue; }
            let overlap = false;
            for (const intervalo of intervalosOcupados) {
                if (inicioCandidato < intervalo.fim && fimCandidato > intervalo.inicio) {
                    overlap = true; break;
                }
            }
            if (!overlap) { horariosDisponiveis.push(horarioCandidatoStr); }
        }
        res.json(horariosDisponiveis);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno ao buscar horários disponíveis.', error: error.message });
    } finally {
        if (connection) await connection.end();
    }
});

app.get('/api/produtos', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [produtos] = await connection.execute('SELECT id, nome, preco, imagem_url, descricao, estoque FROM produtos WHERE estoque > 0 ORDER BY nome ASC');
        res.json(produtos);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno ao buscar produtos.' });
    } finally {
        if (connection) await connection.end();
    }
});

app.get('/api/produtos/:id', async (req, res) => {
    const { id } = req.params;
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [produtos] = await connection.execute('SELECT * FROM produtos WHERE id = ?', [id]);
        if (produtos.length === 0) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }
        res.json(produtos[0]);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno ao buscar o produto.' });
    } finally {
        if (connection) await connection.end();
    }
});


// --- ROTAS PROTEGIDAS DE USUÁRIO ---
app.post('/api/agendamentos', autenticarToken, async (req, res) => {
    const { barbeiroId, servicoId, data, horario } = req.body;
    const usuarioId = req.user.userId;
    if (!barbeiroId || !servicoId || !data || !horario) {
        return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
    }
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.beginTransaction();
        const [servicoEscolhidoRows] = await connection.execute('SELECT duracao_minutos FROM servicos WHERE id = ?', [servicoId]);
        if (servicoEscolhidoRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Serviço selecionado não encontrado.' });
        }
        const duracaoNovoServico = servicoEscolhidoRows[0].duracao_minutos;
        const inicioNovoAgendamento = parseDateTime(data, horario);
        const [agendamentosConflitantes] = await connection.execute(
            `SELECT ag.hora_agendamento, s.duracao_minutos FROM agendamentos ag JOIN servicos s ON ag.servico_id = s.id WHERE ag.barbeiro_id = ? AND ag.data_agendamento = ? AND ag.status_agendamento NOT IN (?, ?, ?, ?)`,
            [barbeiroId, data, 'Cancelado', 'Rejeitado', 'Não Compareceu', 'Finalizado']
        );
        for (const ag of agendamentosConflitantes) {
            const inicioExistente = parseDateTime(data, ag.hora_agendamento.substring(0, 5));
            const fimExistente = new Date(inicioExistente.getTime() + ag.duracao_minutos * 60000);
            if (inicioNovoAgendamento < fimExistente && new Date(inicioNovoAgendamento.getTime() + duracaoNovoServico * 60000) > inicioExistente) {
                await connection.rollback();
                return res.status(409).json({ message: 'Conflito: O horário selecionado não está mais disponível.' });
            }
        }
        const [usuarios] = await connection.execute('SELECT nome FROM usuarios WHERE id = ?', [usuarioId]);
        if (usuarios.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Usuário autenticado não encontrado.' });
        }
        const nomeClienteLogado = usuarios[0].nome;
        const [result] = await connection.execute(
            'INSERT INTO agendamentos (barbeiro_id, servico_id, data_agendamento, hora_agendamento, usuario_id, nome_cliente, telefone_cliente) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [barbeiroId, servicoId, data, horario, usuarioId, nomeClienteLogado, null]
        );
        await connection.commit();
        res.status(201).json({ message: 'Agendamento criado com sucesso!', agendamentoId: result.insertId });
    } catch (error) {
        if (connection) await connection.rollback();
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Conflito: Horário já agendado.' });
        }
        res.status(500).json({ message: 'Erro interno ao criar agendamento.', error: error.message });
    } finally {
        if (connection) await connection.end();
    }
});

// Rota para buscar agendamentos ATIVOS (com MODO DETETIVE)
app.get('/api/meus-agendamentos/ativos', autenticarToken, async (req, res) => {
    console.log("\n--- REQUISIÇÃO RECEBIDA: /api/meus-agendamentos/ativos ---");
    const usuarioId = req.user.userId;
    console.log(`1. Buscando agendamentos para o usuário ID: ${usuarioId}`);

    let connection;
    try {
        console.log("2. Tentando conectar ao banco de dados...");
        connection = await mysql.createConnection(dbConfig);
        console.log("3. Conexão com o banco de dados bem-sucedida.");

        const query = `
            SELECT 
                ag.id, ag.data_agendamento, ag.hora_agendamento, ag.status_agendamento,
                s.nome as nome_servico, s.duracao_minutos, s.preco as preco_servico,
                b.nome as nome_barbeiro, ag.observacoes
            FROM agendamentos ag
            JOIN servicos s ON ag.servico_id = s.id
            JOIN barbeiros b ON ag.barbeiro_id = b.id
            WHERE ag.usuario_id = ? 
            AND STR_TO_DATE(CONCAT(ag.data_agendamento, ' ', ag.hora_agendamento), '%Y-%m-%d %H:%i:%s') >= NOW()
            ORDER BY ag.data_agendamento ASC, ag.hora_agendamento ASC;
        `;
        console.log("4. Executando a query SQL no banco...");
        const [agendamentos] = await connection.execute(query, [usuarioId]);
        console.log(`5. Query executada com sucesso. Encontrados ${agendamentos.length} agendamentos.`);

        console.log("6. Enviando resposta JSON para o frontend.");
        res.json(agendamentos);

    } catch (error) {
        console.error("!!-> ERRO na rota /meus-agendamentos/ativos:", error);
        res.status(500).json({ message: 'Erro interno ao buscar seus agendamentos ativos.', error: error.message });
    } finally {
        if (connection) {
            await connection.end();
            console.log("7. Conexão com o banco de dados fechada.");
        }
        console.log("--- FIM DA REQUISIÇÃO: /api/meus-agendamentos/ativos ---\n");
    }
});

app.get('/api/meus-agendamentos/historico', autenticarToken, async (req, res) => {
    const usuarioId = req.user.userId;
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const query = `
            SELECT ag.id, ag.data_agendamento, ag.hora_agendamento, ag.status_agendamento, s.nome as nome_servico, s.duracao_minutos, s.preco as preco_servico, b.nome as nome_barbeiro, ag.observacoes
            FROM agendamentos ag
            JOIN servicos s ON ag.servico_id = s.id
            JOIN barbeiros b ON ag.barbeiro_id = b.id
            WHERE ag.usuario_id = ? AND STR_TO_DATE(CONCAT(ag.data_agendamento, ' ', ag.hora_agendamento), '%Y-%m-%d %H:%i:%s') < NOW()
            ORDER BY ag.data_agendamento DESC, ag.hora_agendamento DESC;
        `;
        const [agendamentos] = await connection.execute(query, [usuarioId]);
        res.json(agendamentos);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno ao buscar seu histórico de agendamentos.', error: error.message });
    } finally {
        if (connection) await connection.end();
    }
});

app.delete('/api/agendamentos/:agendamentoId', autenticarToken, async (req, res) => {
    const { agendamentoId } = req.params;
    const usuarioIdToken = req.user.userId;
    if (!agendamentoId || isNaN(parseInt(agendamentoId))) {
        return res.status(400).json({ message: 'ID do agendamento inválido.' });
    }
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.beginTransaction();
        const [agendamentos] = await connection.execute('SELECT id, usuario_id, data_agendamento, hora_agendamento, status_agendamento FROM agendamentos WHERE id = ?', [agendamentoId]);
        if (agendamentos.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Agendamento não encontrado.' });
        }
        const agendamento = agendamentos[0];
        if (agendamento.usuario_id !== usuarioIdToken) {
            await connection.rollback();
            return res.status(403).json({ message: 'Você não tem permissão para cancelar este agendamento.' });
        }
        const dataAgendamentoString = new Date(agendamento.data_agendamento).toISOString().split('T')[0];
        const agendamentoDateTime = parseDateTime(dataAgendamentoString, agendamento.hora_agendamento.substring(0, 5));
        if (agendamentoDateTime < new Date()) {
            await connection.rollback();
            return res.status(400).json({ message: 'Não é possível cancelar agendamentos que já ocorreram.' });
        }
        if (['Cancelado', 'Finalizado', 'Não Compareceu'].includes(agendamento.status_agendamento)) {
            await connection.rollback();
            return res.status(400).json({ message: `Este agendamento já está com status "${agendamento.status_agendamento}"` });
        }
        const [result] = await connection.execute('DELETE FROM agendamentos WHERE id = ? AND usuario_id = ?', [agendamentoId, usuarioIdToken]);
        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Agendamento não encontrado para exclusão.' });
        }
        await connection.commit();
        res.status(200).json({ message: 'Agendamento cancelado com sucesso.' });
    } catch (error) {
        if (connection) await connection.rollback();
        res.status(500).json({ message: 'Erro interno ao cancelar o agendamento.', error: error.message });
    } finally {
        if (connection) await connection.end();
    }
});


// --- ROTAS DE ADMINISTRAÇÃO ---
app.get('/api/admin/agendamentos', [autenticarToken, autenticarAdmin], async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const query = `
            SELECT ag.id, ag.data_agendamento, ag.hora_agendamento, ag.status_agendamento, ag.nome_cliente, u.email as email_cliente, s.nome as nome_servico, b.nome as nome_barbeiro
            FROM agendamentos ag
            JOIN usuarios u ON ag.usuario_id = u.id JOIN servicos s ON ag.servico_id = s.id JOIN barbeiros b ON ag.barbeiro_id = b.id
            ORDER BY ag.data_agendamento DESC, ag.hora_agendamento DESC LIMIT 100;
        `;
        const [agendamentos] = await connection.execute(query);

        const [[{ total_agendamentos }]] = await connection.execute('SELECT COUNT(*) as total_agendamentos FROM agendamentos');
        const [[{ total_usuarios }]] = await connection.execute('SELECT COUNT(*) as total_usuarios FROM usuarios');
        const [[{ total_produtos }]] = await connection.execute('SELECT COUNT(*) as total_produtos FROM produtos');

        res.json({
            agendamentos,
            kpis: { totalAgendamentos: total_agendamentos, totalUsuarios: total_usuarios, totalProdutos: total_produtos }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno ao buscar dados do dashboard.' });
    } finally {
        if (connection) await connection.end();
    }
});

app.post('/api/admin/produtos', [autenticarToken, autenticarAdmin], async (req, res) => {
    const { nome, descricao, preco, estoque, imagem_url } = req.body;
    if (!nome || preco === undefined) {
        return res.status(400).json({ message: 'Nome e Preço são obrigatórios.' });
    }
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const query = 'INSERT INTO produtos (nome, descricao, preco, estoque, imagem_url) VALUES (?, ?, ?, ?, ?)';
        const [result] = await connection.execute(query, [nome, descricao, preco, estoque || 0, imagem_url]);
        res.status(201).json({ message: 'Produto criado com sucesso!', produtoId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno ao criar produto.' });
    } finally {
        if (connection) await connection.end();
    }
});

app.put('/api/admin/produtos/:id', [autenticarToken, autenticarAdmin], async (req, res) => {
    const { id } = req.params;
    const { nome, descricao, preco, estoque, imagem_url } = req.body;
    if (!nome || preco === undefined) {
        return res.status(400).json({ message: 'Nome e Preço são obrigatórios.' });
    }
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const query = 'UPDATE produtos SET nome = ?, descricao = ?, preco = ?, estoque = ?, imagem_url = ? WHERE id = ?';
        const [result] = await connection.execute(query, [nome, descricao, preco, estoque || 0, imagem_url, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }
        res.status(200).json({ message: 'Produto atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno ao atualizar produto.' });
    } finally {
        if (connection) await connection.end();
    }
});

app.delete('/api/admin/produtos/:id', [autenticarToken, autenticarAdmin], async (req, res) => {
    const { id } = req.params;
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute('DELETE FROM produtos WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }
        res.status(200).json({ message: 'Produto excluído com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno ao excluir produto.' });
    } finally {
        if (connection) await connection.end();
    }
});


// --- INICIAR SERVIDOR ---
app.listen(port, () => {
    console.log(`Servidor backend rodando em http://localhost:${port}`);
    mysql.createConnection(dbConfig)
        .then(conn => { console.log('Conexão com o MySQL bem-sucedida!'); conn.end(); })
        .catch(err => console.error('Falha ao conectar com o MySQL:', err.message));
});