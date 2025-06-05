// src/backend/server.js
const express = require('express');
const mysql = require('mysql2/promise'); // Usando a versão com Promises do mysql2
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares Globais
app.use(cors());
app.use(express.json()); // Para parsing de application/json
app.use(express.urlencoded({ extended: true })); // Para parsing de application/x-www-form-urlencoded

// Configuração da conexão com o MySQL
const dbConfig = {
    host: 'localhost',
    user: 'root',         // SEU USUÁRIO MYSQL (ex: root)
    password: '713368',   // SUA SENHA MYSQL (substitua pela sua senha)
    database: 'nareguabanco' // SEU BANCO DE DADOS (ex: nareguabanco)
};

// Chave secreta para JWT - MUDE E GUARDE EM LOCAL SEGURO (variável de ambiente em produção)
const JWT_SECRET = 'SEU_SEGREDO_SUPER_SECRETO_PARA_JWT_AQUI_TROQUE_ISSO_IMEDIATAMENTE';

// --- FUNÇÕES AUXILIARES DE DATA/HORA ---
/**
 * Converte uma string de data (YYYY-MM-DD) e uma string de hora (HH:MM) em um objeto Date.
 * @param {string} dateStr Data no formato "YYYY-MM-DD"
 * @param {string} timeStr Hora no formato "HH:MM"
 * @returns {Date} Objeto Date correspondente
 */
function parseDateTime(dateStr, timeStr) {
    return new Date(`${dateStr}T${timeStr}:00`); // Assume fuso horário local do servidor
}

/**
 * Formata um objeto Date para uma string de hora "HH:MM".
 * @param {Date} dateObj Objeto Date
 * @returns {string} Hora formatada como "HH:MM"
 */
function formatTime(dateObj) {
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// --- MIDDLEWARE DE AUTENTICAÇÃO JWT ---
// Definido ANTES das rotas que o utilizam
const autenticarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato "Bearer TOKEN"

    if (token == null) return res.sendStatus(401); // Não autorizado se não houver token

    jwt.verify(token, JWT_SECRET, (err, userPayload) => {
        if (err) {
            console.error("Erro na verificação do JWT:", err.message); // Log do erro
            return res.sendStatus(403); // Token inválido ou expirado
        }
        req.user = userPayload; // Adiciona o payload do usuário ao objeto req
        next();
    });
};

// --- ROTAS DE AUTENTICAÇÃO E USUÁRIO ---

// REGISTRO DE USUÁRIO (com telefone)
app.post('/api/usuarios/registrar', async (req, res) => {
    const { nome, cpf, email, senha, telefone } = req.body;

    if (!nome || (!cpf && !email) || !senha) {
        return res.status(400).json({ message: 'Nome, (CPF ou Email), e Senha são obrigatórios.' });
    }
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
            queryVerifica += (paramsVerifica.length > 0 ? ' OR' : '') + ' email = ?';
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
    const { usuario, senha } = req.body; // 'usuario' pode ser CPF ou Email

    if (!usuario || !senha) {
        return res.status(400).json({ message: 'Usuário (CPF/Email) e Senha são obrigatórios.' });
    }

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const cpfLimpoLogin = String(usuario).replace(/\D/g, '');

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

// RECUPERAÇÃO DE SENHA (Exemplo simplificado via CPF)
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

// ROTA PARA EXCLUIR A PRÓPRIA CONTA (PROTEGIDA)
// Utiliza o middleware 'autenticarToken' que agora está definido acima
app.delete('/api/usuarios/minha-conta', autenticarToken, async (req, res) => {
    const usuarioId = req.user.userId;

    if (!usuarioId) {
        // Isso não deveria acontecer se autenticarToken funcionou corretamente
        return res.status(400).json({ message: 'ID do usuário não encontrado no token.' });
    }

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.beginTransaction();

        // A tabela 'agendamentos' tem ON DELETE CASCADE, então agendamentos são excluídos.
        const [result] = await connection.execute(
            'DELETE FROM usuarios WHERE id = ?',
            [usuarioId]
        );

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Usuário não encontrado para exclusão.' });
        }

        await connection.commit();
        res.status(200).json({ message: 'Sua conta e todos os dados associados foram excluídos com sucesso.' });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Erro ao excluir conta do usuário:', error);
        res.status(500).json({ message: 'Erro interno ao excluir sua conta.', error: error.message });
    } finally {
        if (connection) await connection.end();
    }
});


// --- ROTAS DE AGENDAMENTO (Públicas e Protegidas) ---

// Rota para buscar todos os barbeiros (PÚBLICA)
app.get('/api/barbeiros', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT id, nome FROM barbeiros ORDER BY nome ASC');
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
        const [rows] = await connection.execute('SELECT id, nome, duracao_minutos, preco FROM servicos ORDER BY nome ASC');
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar servicos:', error);
        res.status(500).json({ message: 'Erro ao buscar servicos', error: error.message });
    } finally {
        if (connection) await connection.end();
    }
});

// Rota para buscar horários disponíveis (PÚBLICA - LÓGICA APRIMORADA)
app.get('/api/horarios-disponiveis', async (req, res) => {
    const { barbeiroId, data, servicoId } = req.query; // data deve estar no formato "YYYY-MM-DD"

    if (!barbeiroId || !data || !servicoId) {
        return res.status(400).json({ message: 'Parâmetros barbeiroId, data e servicoId são obrigatórios.' });
    }

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        const [servicoEscolhidoRows] = await connection.execute(
            'SELECT duracao_minutos FROM servicos WHERE id = ?',
            [servicoId]
        );

        if (servicoEscolhidoRows.length === 0) {
            return res.status(404).json({ message: 'Serviço não encontrado.' });
        }
        const duracaoNovoServico = servicoEscolhidoRows[0].duracao_minutos;

        const [agendamentosExistentes] = await connection.execute(
            `SELECT ag.hora_agendamento, s.duracao_minutos
             FROM agendamentos ag
             JOIN servicos s ON ag.servico_id = s.id
             WHERE ag.barbeiro_id = ?
               AND ag.data_agendamento = ?
               AND ag.status_agendamento NOT IN (?, ?, ?, ?)`,
            [barbeiroId, data, 'Cancelado', 'Rejeitado', 'Não Compareceu', 'Finalizado']
        );

        const horariosPadraoIniciais = [
            "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
            "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
            "16:00", "16:30", "17:00", "17:30", "18:00"
        ];
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

            if (fimCandidato > fimExpedienteDateTime) {
                continue;
            }

            let overlap = false;
            for (const intervalo of intervalosOcupados) {
                if (inicioCandidato < intervalo.fim && fimCandidato > intervalo.inicio) {
                    overlap = true;
                    break;
                }
            }

            if (!overlap) {
                horariosDisponiveis.push(horarioCandidatoStr);
            }
        }
        res.json(horariosDisponiveis);
    } catch (error) {
        console.error('Erro ao buscar horários disponíveis:', error);
        res.status(500).json({ message: 'Erro interno ao buscar horários disponíveis.', error: error.message });
    } finally {
        if (connection) await connection.end();
    }
});

// Rota para CRIAR um novo agendamento (PROTEGIDA)
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
        const fimNovoAgendamento = new Date(inicioNovoAgendamento.getTime() + duracaoNovoServico * 60000);

        const [agendamentosConflitantes] = await connection.execute(
            `SELECT ag.hora_agendamento, s.duracao_minutos
             FROM agendamentos ag JOIN servicos s ON ag.servico_id = s.id
             WHERE ag.barbeiro_id = ? AND ag.data_agendamento = ? AND ag.status_agendamento NOT IN (?, ?, ?, ?)`,
            [barbeiroId, data, 'Cancelado', 'Rejeitado', 'Não Compareceu', 'Finalizado']
        );

        for (const ag of agendamentosConflitantes) {
            const inicioExistente = parseDateTime(data, ag.hora_agendamento.substring(0, 5));
            const fimExistente = new Date(inicioExistente.getTime() + ag.duracao_minutos * 60000);
            if (inicioNovoAgendamento < fimExistente && fimNovoAgendamento > inicioExistente) {
                await connection.rollback();
                return res.status(409).json({ message: 'Conflito: O horário selecionado não está mais disponível.' });
            }
        }

        const [usuarios] = await connection.execute(
            'SELECT nome, telefone FROM usuarios WHERE id = ?',
            [usuarioId]
        );

        if (usuarios.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Usuário autenticado não encontrado no banco de dados.' });
        }
        const nomeClienteLogado = usuarios[0].nome;
        const telefoneClienteLogado = usuarios[0].telefone;

        const [result] = await connection.execute(
            'INSERT INTO agendamentos (barbeiro_id, servico_id, data_agendamento, hora_agendamento, usuario_id, nome_cliente, telefone_cliente) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [barbeiroId, servicoId, data, horario, usuarioId, nomeClienteLogado, telefoneClienteLogado]
        );

        await connection.commit();
        res.status(201).json({ message: 'Agendamento criado com sucesso!', agendamentoId: result.insertId });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Erro ao criar agendamento:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Conflito: Horário já agendado (duplicidade no banco).' });
        }
        res.status(500).json({ message: 'Erro interno ao criar agendamento.', error: error.message });
    } finally {
        if (connection) await connection.end();
    }
});

// Rota para buscar agendamentos de um usuário (PROTEGIDA)
app.get('/api/meus-agendamentos', autenticarToken, async (req, res) => {
    const usuarioId = req.user.userId;
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const query = `
            SELECT 
                ag.id,
                ag.data_agendamento,
                ag.hora_agendamento,
                ag.status_agendamento,
                s.nome as nome_servico,
                s.duracao_minutos,
                s.preco as preco_servico,
                b.nome as nome_barbeiro,
                ag.observacoes
            FROM agendamentos ag
            JOIN servicos s ON ag.servico_id = s.id
            JOIN barbeiros b ON ag.barbeiro_id = b.id
            WHERE ag.usuario_id = ?
            ORDER BY ag.data_agendamento DESC, ag.hora_agendamento DESC;
        `;
        const [agendamentos] = await connection.execute(query, [usuarioId]);
        res.json(agendamentos);
    } catch (error) {
        console.error('Erro ao buscar meus agendamentos:', error);
        res.status(500).json({ message: 'Erro interno ao buscar seus agendamentos.', error: error.message });
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
        .catch(err => console.error('Falha ao conectar com o MySQL ao iniciar o servidor:', err.message, '\nVerifique suas credenciais e se o MySQL está rodando.'));
});