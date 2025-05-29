const express = require('express');
const mysql = require('mysql2/promise'); // Usando a versão com Promises
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000; // Porta para o backend

// Middlewares
app.use(cors()); // Habilita CORS para todas as rotas
app.use(express.json()); // Para parsear JSON no corpo das requisições
app.use(express.urlencoded({ extended: true })); // Para parsear dados de formulários URL-encoded

// Configuração da conexão com o MySQL
const dbConfig = {
    host: 'localhost',      // Ou o IP do seu servidor MySQL
    user: 'root',           // Seu usuário do MySQL
    password: '713368',  // Sua senha do MySQL
    database: 'nareguabanco'  // O nome do banco que você criou
};

// Função para testar a conexão (opcional, mas bom para debug)
async function testDbConnection() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Conexão com o MySQL bem-sucedida!');
        await connection.end();
    } catch (error) {
        console.error('Erro ao conectar com o MySQL:', error);
    }
}
testDbConnection();

// --- ROTAS DA API ---

// Rota para buscar todos os barbeiros
app.get('/api/barbeiros', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT id, nome FROM barbeiros');
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar barbeiros:', error);
        res.status(500).json({ message: 'Erro ao buscar barbeiros', error: error.message });
    }
});

// Rota para buscar todos os serviços
app.get('/api/servicos', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT id, nome, duracao_minutos FROM servicos');
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar servicos:', error);
        res.status(500).json({ message: 'Erro ao buscar servicos', error: error.message });
    }
});

// Rota para buscar horários disponíveis (Exemplo SIMPLIFICADO)
// Você precisará de uma lógica mais robusta aqui
app.get('/api/horarios-disponiveis', async (req, res) => {
    const { barbeiroId, data, servicoId } = req.query; // data no formato 'YYYY-MM-DD'

    if (!barbeiroId || !data || !servicoId) {
        return res.status(400).json({ message: 'Parâmetros barbeiroId, data e servicoId são obrigatórios.' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);

        // 1. Buscar o serviço para saber a duração
        const [servicoRows] = await connection.execute('SELECT duracao_minutos FROM servicos WHERE id = ?', [servicoId]);
        if (servicoRows.length === 0) {
            await connection.end();
            return res.status(404).json({ message: 'Serviço não encontrado.' });
        }
        const duracaoServico = servicoRows[0].duracao_minutos;

        // 2. Buscar agendamentos existentes para o barbeiro e data
        const [agendamentos] = await connection.execute(
            'SELECT hora_agendamento, s.duracao_minutos AS duracao_servico_agendado FROM agendamentos a JOIN servicos s ON a.servico_id = s.id WHERE barbeiro_id = ? AND data_agendamento = ? ORDER BY hora_agendamento',
            [barbeiroId, data]
        );
        await connection.end();

        // 3. Lógica para determinar horários disponíveis
        // Esta é uma lógica de exemplo e precisa ser refinada:
        const horariosPadrao = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
        let horariosDisponiveis = [...horariosPadrao]; // Começa com todos os horários possíveis

        // Simplificação: Remove horários já ocupados.
        // Uma lógica real consideraria a duração do serviço selecionado e a duração dos serviços já agendados
        // para evitar sobreposições.
        agendamentos.forEach(ag => {
            // Remove o horário de início do agendamento existente
            horariosDisponiveis = horariosDisponiveis.filter(h => h !== ag.hora_agendamento.substring(0, 5));
            // Aqui você precisaria de uma lógica mais complexa para bloquear slots com base na duração
        });

        res.json(horariosDisponiveis);

    } catch (error) {
        console.error('Erro ao buscar horários disponíveis:', error);
        res.status(500).json({ message: 'Erro ao buscar horários disponíveis', error: error.message });
    }
});


// Rota para criar um novo agendamento
app.post('/api/agendamentos', async (req, res) => {
    const { barbeiroId, servicoId, data, horario, nomeCliente } = req.body;

    // Validação básica (melhorar com bibliotecas como Joi ou express-validator)
    if (!barbeiroId || !servicoId || !data || !horario) {
        return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        // TODO: Adicionar verificação se o horário ainda está disponível antes de inserir

        const [result] = await connection.execute(
            'INSERT INTO agendamentos (barbeiro_id, servico_id, data_agendamento, hora_agendamento, nome_cliente) VALUES (?, ?, ?, ?, ?)',
            [barbeiroId, servicoId, data, horario, nomeCliente || null]
        );
        await connection.end();

        res.status(201).json({ message: 'Agendamento criado com sucesso!', agendamentoId: result.insertId });
    } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        // Verificar erro de chave duplicada (ex: agendamento já existe para o mesmo barbeiro, data e hora)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Este horário já está agendado.' });
        }
        res.status(500).json({ message: 'Erro ao criar agendamento', error: error.message });
    }
});


// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor backend rodando em http://localhost:${port}`);
});