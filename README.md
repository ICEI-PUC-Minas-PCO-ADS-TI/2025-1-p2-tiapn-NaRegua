# NaRégua

`CURSO: Análise e Desenvolvimento de Sistemas`

`DISCIPLINA: Trabalho Interdisciplinar Aplicações para Processos de Negócios`

`1º semestre/2025`

O objetivo de projeto é implementar um sistema de gestão de agendamentos para uma barberia que realiza o agendamento de seus clientes de maneira manual, a caneta e caderno. A aplicação proporcionará um crescimento tecnológico considerável para o négocio em questão. Dessa forma, nosso colaborador terá mais controle e organização de seu fluxo de clientes, e isso acarretará em eficiência, agilidade, modernização e principalmente automatização. 

## Integrantes

* Erik Cristian de Alcântara Costa
* Franklin Fernando Dias Reis Filho
* Guilherme de Assis Thiebaut
* Gustavo Bernardo Nunes dos Santos
* Ivan Barreto Murta
* Juan Luciano Cunha Silva

## Professor

* Amália Soares Vieira de Vasconcelos

## Instruções de utilização

Guia para Abrir e Executar a Aplicação "Na Régua" 
Este guia irá orientá-lo sobre como configurar e executar a aplicação de agendamento 
"Na Régua", que consiste em um backend Node.js/Express, um frontend 
HTML/CSS/JavaScript e um banco de dados MySQL. 

1. Pré-requisitos 
Antes de começar, certifique-se de ter os seguintes softwares instalados em seu 
computador: 
• Node.js e npm: 
o Node.js é o ambiente de execução para o backend. npm (Node Package 
Manager) vem com o Node.js e é usado para gerenciar as dependências 
do projeto. 
o Você pode baixar em nodejs.org. 
• Um cliente MySQL (Recomendado): 
o Ferramenta para administrar o banco de dados, como MySQL 
Workbench, DBeaver, phpMyAdmin (se usar XAMPP/WAMP), ou a 
linha de comando mysql.

3. Configuração do Banco de Dados MySQL
   
1. Inicie o Servidor MySQL: Certifique-se de que seu servidor MySQL esteja em 
execução.

3. Acesse o MySQL: Use seu cliente MySQL para se conectar ao servidor. 
Normalmente, você se conectará como usuário root ou outro usuário com 
permissões para criar bancos de dados e tabelas.

5. Execute o Script SQL: Você precisará executar o script SQL que foi fornecido 
anteriormente para criar: 
o O banco de dados nareguabanco. 
o As tabelas: usuarios, barbeiros, servicos, agendamentos. 
o Inserir dados iniciais (como o barbeiro "Lucas" e os serviços). 
Copie o script SQL completo localizado em src/db/Script.sql (que inclui CREATE 
DATABASE, USE nareguabanco, CREATE TABLE para todas as tabelas, e os 
INSERT INTO para dados iniciais) e execute-o no seu cliente MySQL.

3. Configuração do Backend (Node.js)
   
1. Navegue até a Pasta do Backend: Abra seu terminal ou prompt de comando e 
navegue até a pasta onde o arquivo server.js está localizado. O caminho final 
será esse, o começo dependerá de onde você baixou o projeto. 
cd NaRegua\2025-1-p2-tiapn-NaRegua\src\backend 
Ajuste o caminho conforme necessário.

3. Instale as Dependências: Se você ainda não o fez, instale os pacotes Node.js 
necessários executando: 
Bash 
npm install 
Isso lerá o arquivo package.json (se existir, caso contrário, você precisaria 
instalar express mysql2 cors bcryptjs jsonwebtoken individualmente) e 
baixará as bibliotecas. 
Configure o server.js: Abra o arquivo server.js em um editor de 
texto/código e verifique/ajuste o seguinte: 
o dbConfig: 
JavaScript 
const dbConfig = { 
host: 'localhost', 
user: 'Seu Usuário',  
password: 'Sua Senha', 
database: 'nareguabanco' 
}; 
// SEU USUÁRIO MYSQL 
// SUA SENHA MYSQL 
Certifique-se de que user e password correspondem às suas credenciais 
do MySQL. O database deve ser nareguabanco.

4. Inicie o Servidor Backend: No terminal, dentro da pasta src/backend, 
execute: 
node server.js 
Se tudo estiver correto, você verá uma mensagem como: 
Servidor backend rodando em http://localhost:3000 
Conexão com o MySQL bem-sucedida ao iniciar o servidor!

5. Acessando o Frontend: 
• Use um Servidor Live (Recomendado para Desenvolvimento): Se você 
estiver usando um editor como o VS Code, extensões como "Live Server" 
podem servir seus arquivos HTML. Isso cria um pequeno servidor web local e 
oferece recarregamento automático. Clique com o botão direito no arquivo 
login.html no VS Code e escolha "Open with Live Server". 
• Eu desenvolvi a página de Recuperar Senha, para acessar abra o vs 
code com a pasta, abre src em seguida front, auth e por fim 
recuperar senha.

# Documentação

<ol>
<li><a href="docs/01-Contexto.md"> Documentação de contexto</a></li>
<li><a href="docs/02-Especificacao.md"> Especificação do projeto</a></li>
<li><a href="docs/03-Metodologia.md"> Metodologia</a></li>
<li><a href="docs/04-Modelagem-processos-negocio.md"> Modelagem dos processos de negócios</a></li>
<li><a href="docs/05-Projeto-interface.md"> Projeto de interface</a></li>
<li><a href="docs/06-Template-padrao.md"> Template padrão da aplicação</a></li>
<li><a href="docs/07-Arquitetura-solucao.md"> Arquitetura da solução</a></li>
<li><a href="docs/08-Plano-testes-software.md"> Plano de testes de software</a></li>
<li><a href="docs/09-Registro-testes-software.md"> Registro de testes de software</a></li>
<li><a href="docs/10-Conclusao.md"> Conclusão</a></li>
<li><a href="docs/11-Referencias.md"> Referências</a></li>
</ol>

# Código

* <a href="src/README.md">Código</a>

# Apresentação

* <a href="presentation/README.md">Apresentação do projeto</a>
