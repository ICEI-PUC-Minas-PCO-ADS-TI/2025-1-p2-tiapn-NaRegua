# Arquitetura da solução

<span style="color:red">Pré-requisitos: <a href="05-Projeto-interface.md"> Projeto de interface</a></span>

Definição de como o software é estruturado em termos dos componentes que fazem parte da solução e do ambiente de hospedagem da aplicação.

![](images/ArquiteturadeSolução.png)

## Diagrama de classes

O diagrama de classes ilustra graficamente a estrutura do software e como cada uma das classes estará interligada. Essas classes servem de modelo para materializar os objetos que serão executados na memória.
![](images/NaReguaDiagramadeClasses.png)


##  Modelo de dados

O desenvolvimento da solução proposta requer a existência de bases de dados que permitam realizar o cadastro de dados e os controles associados aos processos identificados, assim como suas recuperações.

Utilizando a notação do DER (Diagrama Entidade-Relacionamento), elabore um modelo, usando alguma ferramenta, que contemple todas as entidades e atributos associados às atividades dos processos identificados. Deve ser gerado um único DER que suporte todos os processos escolhidos, visando, assim, uma base de dados integrada. O modelo deve contemplar também o controle de acesso dos usuários (partes interessadas nos processos) de acordo com os papéis definidos nos modelos do processo de negócio.

Apresente o modelo de dados por meio de um modelo relacional que contemple todos os conceitos e atributos apresentados na modelagem dos processos.

### Modelo ER

O Modelo ER representa, por meio de um diagrama, como as entidades (coisas, objetos) se relacionam entre si na aplicação interativa.
![](images/ModeloER.png)



### Esquema relacional

O Esquema Relacional corresponde à representação dos dados em tabelas juntamente com as restrições de integridade e chave primária.
 
![](images/EsquemaRelacional.png)

---



### Modelo físico

Insira aqui o script de criação das tabelas do banco de dados.



```sql
-- Script final para criar o banco de dados e todas as tabelas.

CREATE DATABASE IF NOT EXISTS bncjzdu8swnlmwhhwnp1 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
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

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS produtos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
    estoque INT UNSIGNED DEFAULT 0,
    imagem_url VARCHAR(1024),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NOVA TABELA DE RESERVAS DE PRODUTOS
CREATE TABLE IF NOT EXISTS reservas_produtos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    produto_id INT UNSIGNED NOT NULL,
    quantidade INT UNSIGNED NOT NULL,
    status VARCHAR(50) DEFAULT 'Ativa', -- Ex: Ativa, Retirada, Cancelada
    data_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE RESTRICT
);

-- Inserção de Dados Iniciais
INSERT IGNORE INTO usuarios (nome, cpf, email, senha_hash, is_admin) VALUES
('Admin', '00000000000', 'admin@naregua.com', '$2b$10$g9pxUF0H5JzhUvYJr.f2u.e7V3jbDT2yWGXz5c05KexoNPAGWwgOG', TRUE);
INSERT IGNORE INTO barbeiros (nome) VALUES ('Lucas');
INSERT IGNORE INTO produtos (nome, descricao, preco, estoque, imagem_url) VALUES
('Gel Fixador Men Essence', 'O Gel Fixador Men Essence Fixação Megaforte garante 24h de controle do penteado, sem ressecar os fios.', 19.90, 15, 'https://www.salonline.com.br/ccstore/v1/images/?source=/file/v7405439105588429855/products/32243%20GEL%20FORTE%20MEN%20300G%20(1).jpg&height=940&width=940'),
('Pomada Modeladora Efeito Matte', 'Ideal para estilizar o cabelo com acabamento fosco e natural. Alta fixação e fácil remoção.', 25.50, 20, 'https://farmagora.vteximg.com.br/arquivos/ids/202595-800-800/726946.jpg?v=638227903321000000'),
('Shampoo Anticaspa Clear Man', 'Tratamento eficaz contra a caspa, com sensação de frescor e limpeza profunda.', 22.00, 30, 'https://m.media-amazon.com/images/I/61LONPQTY9L._UF1000,1000_QL80_.jpg'),
('Óleo para Barba Hidratante', 'Hidrata, amacia e dá brilho à barba, com uma fragrância amadeirada suave.', 35.00, 12, 'https://cdn.sistemawbuy.com.br/arquivos/0f2a4340b7f91641e49c7e5b8a1c598a/produtos/MUA5KEI6/a-leo-para-barba-urban-men-30ml-1-637044ecc520a.jpg');
```
Esse script deverá ser incluído em um arquivo .sql na pasta [de scripts SQL](../src/db).


## Tecnologias




| **Dimensão**   | **Tecnologia**  |
| ---            | ---             |
| Front-end      | HTML + CSS + JS + React |
| Back-end       | Node.js         |
| SGBD           | MySQL           |
| Deploy         | Vercel e Clever Cloud         |



## Hospedagem

Explique como a hospedagem e o lançamento da plataforma foram realizados.

Etapas que serão realizadas:

Organização do Repositório:

Será feita a verificação da estrutura do projeto, garantindo que todos os arquivos necessários estejam organizados em um repositório no GitHub.

Caso ainda não tenha sido feito, o projeto será versionado e enviado para um repositório público ou privado na plataforma.

Criação da Conta na Vercel:

Será criada uma conta no site da Vercel, utilizando um e-mail ou conectando diretamente com a conta do GitHub.

O GitHub será integrado à conta da Vercel, permitindo a seleção de repositórios para deploy automático.

Importação do Projeto para a Vercel:

O repositório do projeto será importado pela Vercel.

A plataforma deverá identificar automaticamente o tipo de projeto (HTML/CSS/JS simples, React, Next.js, etc.).

As configurações de build e de saída (caso necessárias) serão ajustadas manualmente.

Configuração do Deploy:

O primeiro deploy será iniciado após a configuração da importação.

A Vercel será configurada para realizar deploys automáticos a cada novo push ou merge na branch principal do repositório.

Geração do Link de Acesso:

Após o deploy, a Vercel irá fornecer um link público onde a plataforma poderá ser acessada.

Existe também a possibilidade de configurar um domínio personalizado posteriormente, caso necessário.

Testes Finais e Verificação:

Será feita uma verificação do funcionamento da plataforma já hospedada, testando os principais fluxos e links.

Qualquer erro identificado será corrigido e uma nova versão será implantada automaticamente pela Vercel.

Resultado Esperado:

Ao final dessas etapas, a plataforma estará hospedada com sucesso na internet, com deploy contínuo ativado e acessível por um link público fornecido pela Vercel.




## Qualidade de software

Com base nos levamentamentos adquiridos pela equipe, para um site bem estruturado, as qualidades de Software podem ser descritas com base em modelos como a ISO/IEC 25010, que define atributos de qualidade como funcionalidade, usabilidade, desempenho, confiabilidade, segurança e portabilidade.

**FUNCIONALIDADE**
- O sistema deve permitir que usuários agendem horários com barbeiros disponíveis, exibindo corretamente as datas e horários.
- Deve permitir cadastro, login, escolha de serviços, agendamento, cancelamento e notificações.
- Integração com sistemas de pagamento, calendários e redes sociais.

**USABILIDADE**
- Interface intuitiva e responsiva tanto em desktop quanto mobile.
- Compatível com leitores de tela mobile e com boa navegação por desktop.
- Layout moderno, com feedback visual

**DESEMPENHO E EFICIÊNCIA**
- Páginas devem ter uma ótima atualização.
- Deve suportar picos de acesso simultâneos.
- Backend otimizado para não sobrecarregar o servidor e dando uma melhora no desempenho.

**CONFIABILIDADE**
- Sistema com uptime muito bom.
- Backups semanais e sistema de recuperação em caso de falhas.

**SEGURANÇA**
- Dados dos usuários (como telefone e histórico de agendamentos) protegidos com criptografia.
- Login com senha forte.

**PORTABILIDADE**
- Pode ser usado em diferentes navegadores e dispositivos.
- Funcionar em Android, iOS, Windows, Linux, etc. 
