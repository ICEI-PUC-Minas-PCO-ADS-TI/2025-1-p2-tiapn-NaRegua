// src/backend/server.js
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dbConfig = { host: 'localhost', user: 'root', password: '713368', database: 'bncjzdu8swnlmwhhwnp1' };
const JWT_SECRET = 'SEU_SEGREDO_SUPER_SECRETO_PARA_JWT_AQUI_TROQUE_ISSO_IMEDIATAMENTE';

function parseDateTime(dateStr, timeStr) { return new Date(`${dateStr}T${timeStr}:00.000-03:00`); }

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
    if (req.user && req.user.isAdmin) { next(); }
    else { res.status(403).json({ message: 'Acesso negado. Recurso exclusivo para administradores.' }); }
};

// --- ROTAS DE USUÁRIO ---
app.post('/api/usuarios/registrar', async (req, res) => { /* ... código ... */ });
app.post('/api/usuarios/login', async (req, res) => { /* ... código ... */ });
app.delete('/api/usuarios/minha-conta', autenticarToken, async (req, res) => { /* ... código ... */ });

// --- ROTAS PÚBLICAS ---
app.get('/api/barbeiros', async (req, res) => { /* ... código ... */ });
app.get('/api/servicos', async (req, res) => { /* ... código ... */ });
app.get('/api/horarios-disponiveis', async (req, res) => { /* ... código ... */ });
app.get('/api/produtos', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [produtos] = await connection.execute('SELECT * FROM produtos WHERE estoque > 0 ORDER BY nome ASC');
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
        if (produtos.length === 0) return res.status(404).json({ message: 'Produto não encontrado.' });
        res.json(produtos[0]);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno ao buscar o produto.' });
    } finally {
        if (connection) await connection.end();
    }
});

// --- ROTAS PROTEGIDAS DE USUÁRIO ---
app.post('/api/agendamentos', autenticarToken, async (req, res) => { /* ... código ... */ });
app.get('/api/meus-agendamentos/ativos', autenticarToken, async (req, res) => { /* ... código ... */ });
app.get('/api/meus-agendamentos/historico', autenticarToken, async (req, res) => { /* ... código ... */ });
app.delete('/api/agendamentos/:agendamentoId', autenticarToken, async (req, res) => { /* ... código ... */ });

// NOVA ROTA PROTEGIDA PARA CRIAR RESERVA DE PRODUTO
app.post('/api/reservas', autenticarToken, async (req, res) => {
    const { produtoId, quantidade } = req.body;
    const usuarioId = req.user.userId;

    if (!produtoId || !quantidade || parseInt(quantidade) <= 0) {
        return res.status(400).json({ message: 'ID do produto e quantidade válida são obrigatórios.' });
    }

    const connection = await mysql.createConnection(dbConfig);
    try {
        await connection.beginTransaction();
        const [produtos] = await connection.execute('SELECT estoque FROM produtos WHERE id = ? FOR UPDATE', [produtoId]);
        if (produtos.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }
        const estoqueAtual = produtos[0].estoque;
        if (estoqueAtual < quantidade) {
            await connection.rollback();
            return res.status(400).json({ message: `Estoque insuficiente. Apenas ${estoqueAtual} unidades disponíveis.` });
        }
        await connection.execute('UPDATE produtos SET estoque = estoque - ? WHERE id = ?', [quantidade, produtoId]);
        await connection.execute('INSERT INTO reservas_produtos (usuario_id, produto_id, quantidade) VALUES (?, ?, ?)', [usuarioId, produtoId, quantidade]);
        await connection.commit();
        res.status(201).json({ message: 'Produto reservado com sucesso!' });
    } catch (error) {
        await connection.rollback();
        console.error('Erro ao criar reserva de produto:', error);
        res.status(500).json({ message: 'Erro interno ao processar sua reserva.' });
    } finally {
        if (connection) await connection.end();
    }
});


// --- ROTAS DE ADMINISTRAÇÃO ---
app.get('/api/admin/agendamentos', [autenticarToken, autenticarAdmin], async (req, res) => { /* ... código ... */ });
app.get('/api/admin/produtos', [autenticarToken, autenticarAdmin], async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [produtos] = await connection.execute('SELECT * FROM produtos ORDER BY nome ASC');
        res.json(produtos);
    } catch (error) { res.status(500).json({ message: 'Erro ao buscar produtos para admin.' }); }
    finally { if (connection) await connection.end(); }
});
app.post('/api/admin/produtos', [autenticarToken, autenticarAdmin], async (req, res) => { /* ... código ... */ });
app.put('/api/admin/produtos/:id', [autenticarToken, autenticarAdmin], async (req, res) => { /* ... código ... */ });
app.delete('/api/admin/produtos/:id', [autenticarToken, autenticarAdmin], async (req, res) => { /* ... código ... */ });

// NOVA ROTA ADMIN PARA BUSCAR TODAS AS RESERVAS DE PRODUTOS
app.get('/api/admin/reservas', [autenticarToken, autenticarAdmin], async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const query = `
            SELECT r.id, r.quantidade, r.status, r.data_reserva, u.nome as nome_cliente, p.nome as nome_produto
            FROM reservas_produtos r
            JOIN usuarios u ON r.usuario_id = u.id
            JOIN produtos p ON r.produto_id = p.id
            ORDER BY r.data_reserva DESC;
        `;
        const [reservas] = await connection.execute(query);
        res.json(reservas);
    } catch (error) {
        console.error('Erro ao buscar reservas de produtos (admin):', error);
        res.status(500).json({ message: 'Erro interno ao buscar reservas.' });
    } finally {
        if (connection) await connection.end();
    }
});


// --- INICIAR SERVIDOR ---
app.listen(port, () => {
    console.log(`Servidor backend rodando em http://localhost:${port}`);
    // ...
});