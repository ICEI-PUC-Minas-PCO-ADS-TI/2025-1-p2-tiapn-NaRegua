# Arquitetura da solução

<span style="color:red">Pré-requisitos: <a href="05-Projeto-interface.md"> Projeto de interface</a></span>

Definição de como o software é estruturado em termos dos componentes que fazem parte da solução e do ambiente de hospedagem da aplicação.

![](images/Tecnologias.png)

## Diagrama de classes

O diagrama de classes ilustra graficamente a estrutura do software e como cada uma das classes estará interligada. Essas classes servem de modelo para materializar os objetos que serão executados na memória.
![](images/DiagramaClasses.jpeg)


##  Modelo de dados

O desenvolvimento da solução proposta requer a existência de bases de dados que permitam realizar o cadastro de dados e os controles associados aos processos identificados, assim como suas recuperações.

Utilizando a notação do DER (Diagrama Entidade-Relacionamento), elabore um modelo, usando alguma ferramenta, que contemple todas as entidades e atributos associados às atividades dos processos identificados. Deve ser gerado um único DER que suporte todos os processos escolhidos, visando, assim, uma base de dados integrada. O modelo deve contemplar também o controle de acesso dos usuários (partes interessadas nos processos) de acordo com os papéis definidos nos modelos do processo de negócio.

Apresente o modelo de dados por meio de um modelo relacional que contemple todos os conceitos e atributos apresentados na modelagem dos processos.

### Modelo ER

O Modelo ER representa, por meio de um diagrama, como as entidades (coisas, objetos) se relacionam entre si na aplicação interativa.
![](images/DiagramaER.jpeg)



### Esquema relacional

O Esquema Relacional corresponde à representação dos dados em tabelas juntamente com as restrições de integridade e chave primária.
 
![](images/EsquemaRelacional.png)

---



### Modelo físico

Insira aqui o script de criação das tabelas do banco de dados.



```sql
-- Criação do schema
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8mb4;
USE `mydb`;

-- Tabela Barbeiro
CREATE TABLE `Barbeiro` (
  `CPF` VARCHAR(11) NOT NULL,
  `Nome` TEXT,
  `Email` TEXT,
  `Telefone` VARCHAR(11),
  `Rua` TEXT,
  `Numero` INT,
  `Bairro` TEXT,
  `CEP` VARCHAR(8),
  PRIMARY KEY (`CPF`)
) ENGINE = InnoDB;

-- Tabela Cliente
CREATE TABLE `Cliente` (
  `CPF` CHAR(11) NOT NULL,
  `Nome` TEXT,
  `Email` TEXT,
  `Contato_1` VARCHAR(11),
  `Contato_2` VARCHAR(11),
  PRIMARY KEY (`CPF`)
) ENGINE = InnoDB;

-- Tabela Serviços de Cabelo
CREATE TABLE `Servicos_de_cabelo` (
  `ID` INT NOT NULL,
  `Tipo_de_servicos` TEXT,
  `Preco` DECIMAL(10,2),
  `Duracao_media` TIME,
  PRIMARY KEY (`ID`)
) ENGINE = InnoDB;

-- Tabela Produtos
CREATE TABLE `Produtos` (
  `ID` INT NOT NULL,
  `Nome` TEXT,
  `Preco` DECIMAL(10,2),
  `Descricao` TEXT,
  `Quantidade` INT,
  PRIMARY KEY (`ID`)
) ENGINE = InnoDB;

-- Tabela Pomadas de cabelo
CREATE TABLE `Pomadas_de_cabelo` (
  `ID` INT NOT NULL,
  `Tipo_de_cabelo` TEXT,
  `Tamanho_Gramas` INT,
  `Fabricacao` DATE,
  `Validade` DATE,
  PRIMARY KEY (`ID`)
) ENGINE = InnoDB;

-- Tabela Roupas
CREATE TABLE `Roupas` (
  `ID` INT NOT NULL,
  `Peca` TEXT,
  `Tecido` TEXT,
  `Tamanho` TEXT,
  PRIMARY KEY (`ID`)
) ENGINE = InnoDB;

-- Tabela Atende (Relaciona Cliente e Barbeiro)
CREATE TABLE `Atende` (
  `CPF_Cliente` CHAR(11) NOT NULL,
  `CPF_Barbeiro` VARCHAR(11) NOT NULL,
  PRIMARY KEY (`CPF_Cliente`, `CPF_Barbeiro`),
  FOREIGN KEY (`CPF_Cliente`) REFERENCES `Cliente`(`CPF`),
  FOREIGN KEY (`CPF_Barbeiro`) REFERENCES `Barbeiro`(`CPF`)
) ENGINE = InnoDB;

-- Tabela Realiza (Relaciona Barbeiro e Serviços)
CREATE TABLE `Realiza` (
  `ID_Servicos` INT NOT NULL,
  `CPF_Barbeiro` VARCHAR(11) NOT NULL,
  PRIMARY KEY (`ID_Servicos`, `CPF_Barbeiro`),
  FOREIGN KEY (`ID_Servicos`) REFERENCES `Servicos_de_cabelo`(`ID`),
  FOREIGN KEY (`CPF_Barbeiro`) REFERENCES `Barbeiro`(`CPF`)
) ENGINE = InnoDB;

-- Tabela Compra
CREATE TABLE `Compra` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `CPF_Cliente` CHAR(11) NOT NULL,
  PRIMARY KEY (`ID`),
  FOREIGN KEY (`CPF_Cliente`) REFERENCES `Cliente`(`CPF`)
) ENGINE = InnoDB;

-- Compra_has_Produtos (Relaciona Compra e Produtos)
CREATE TABLE `Compra_has_Produtos` (
  `Compra_ID` INT NOT NULL,
  `Produto_ID` INT NOT NULL,
  PRIMARY KEY (`Compra_ID`, `Produto_ID`),
  FOREIGN KEY (`Compra_ID`) REFERENCES `Compra`(`ID`),
  FOREIGN KEY (`Produto_ID`) REFERENCES `Produtos`(`ID`)
) ENGINE = InnoDB;

-- Compra_has_Roupas (Relaciona Compra e Roupas)
CREATE TABLE `Compra_has_Roupas` (
  `Compra_ID` INT NOT NULL,
  `Roupa_ID` INT NOT NULL,
  PRIMARY KEY (`Compra_ID`, `Roupa_ID`),
  FOREIGN KEY (`Compra_ID`) REFERENCES `Compra`(`ID`),
  FOREIGN KEY (`Roupa_ID`) REFERENCES `Roupas`(`ID`)
) ENGINE = InnoDB;

-- Compra_has_Pomadas_de_cabelo
CREATE TABLE `Compra_has_Pomadas_de_cabelo` (
  `Compra_ID` INT NOT NULL,
  `Pomada_ID` INT NOT NULL,
  PRIMARY KEY (`Compra_ID`, `Pomada_ID`),
  FOREIGN KEY (`Compra_ID`) REFERENCES `Compra`(`ID`),
  FOREIGN KEY (`Pomada_ID`) REFERENCES `Pomadas_de_cabelo`(`ID`)
) ENGINE = InnoDB;
```
Esse script deverá ser incluído em um arquivo .sql na pasta [de scripts SQL](../src/db).


## Tecnologias




| **Dimensão**   | **Tecnologia**  |
| ---            | ---             |
| Front-end      | HTML + CSS + JS + React |
| Back-end       | Node.js         |
| SGBD           | MySQL           |
| Deploy         | Vercel          |


## Hospedagem

__**ESTAPAS DOS PROCESSOS DE HOSPEDAGEM E LANÇAMENTO**__


1. **Organização do Repositório no GitHub.**

- Verificação da estrutura do projeto para garantir que todos os arquivos necessários estejam organizados.

- Se ainda não estiver no GitHub, o projeto será versionado e enviado para um repositório (público ou privado).

2. **Criação da Conta na Vercel e Integração.**

- Criação de uma conta na Vercel (via e-mail ou conexão direta com o GitHub).

- Integração do GitHub à conta da Vercel para permitir a seleção de repositórios e o deploy automático.

3. **Importação do Projeto para a Vercel.**

- Importação do repositório do projeto pela Vercel.

- A Vercel identificará automaticamente o tipo de projeto (HTML/CSS/JS, React, Next.js, etc.).

- Ajuste manual das configurações de build e de saída, se necessário.

4. **Configuração do Deploy Contínuo.**

- Início do primeiro deploy após a configuração da importação.

- Configuração da Vercel para realizar deploys automáticos a cada novo push ou merge na branch principal do repositório.

5. **Geração do Link de Acesso.**

- A Vercel fornecerá um link público após o deploy, permitindo o acesso à plataforma.

- Possibilidade de configurar um domínio personalizado posteriormente, se desejado.

6. **Testes Finais e Verificação.**

- Verificação do funcionamento da plataforma já hospedada, testando os principais fluxos e links.

- Correção de erros identificados e implantação automática de novas versões pela Vercel.



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
