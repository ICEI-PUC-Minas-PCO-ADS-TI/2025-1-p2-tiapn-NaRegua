
#  Metodologia

<span style="color:red">Pré-requisitos: <a href="02-Especificacao.md"> Especificação do projeto</a></span>

Para o desenvolvimento do projeto, a equipe adotou uma abordagem colaborativa baseada em metodologias ágeis, com destaque para o uso do Scrum como framework principal de organização. O trabalho foi dividido de forma que todos os integrantes realizassem as tarefas de maneira unânime, com o engajamento da empresa no processo. A empresa em questão é uma barbearia onde uma única pessoa executa todos os processos, desde os serviços até a administração.

Dentre esses processos, realizados por apenas um indivíduo, foram identificados problemas cuja melhor solução seria o uso de tecnologias. Diante disso, o grupo organizou uma visita ao local, onde foram apresentados os principais problemas, ineficiências, processos e serviços realizados.

Após essa visita, o grupo apresentou ao responsável pela barbearia a proposta do trabalho de extensão, explicando os benefícios que ele traria para a empresa. Com o recolhimento das informações e a documentação dos dados necessários, a equipe modelou os processos AS-IS e TO-BE, os quais foram devidamente documentados.

Além disso, o grupo priorizou a participação da empresa na criação dos artefatos. Em relação à divisão de papéis, a equipe se organizou de forma que todos compartilhassem as atividades ao longo da sprint, com foco especial na modelagem dos processos AS-IS e TO-BE, utilizando como principal ferramenta o Bizagi.

Seguindo a metodologia Scrum, o grupo optou por realizar as reuniões por meio do Discord, a fim de auxiliar no acompanhamento das tarefas.


## Controle de versão

A ferramenta de controle de versão adotada no projeto foi o [Git](https://git-scm.com/), sendo que o [GitHub](https://github.com) foi utilizado para hospedagem do repositório.

O projeto segue a seguinte convenção para o nome de branches:

- `main`: versão estável já testada do software
- `unstable`: versão já testada do software, porém instável
- `testing`: versão em testes do software
- `dev`: versão de desenvolvimento do software

Quanto à gerência de issues, o projeto adota a seguinte convenção para etiquetas:

- `documentation`: melhorias ou acréscimos à documentação
- `bug`: uma funcionalidade encontra-se com problemas
- `enhancement`: uma funcionalidade precisa ser melhorada
- `feature`: uma nova funcionalidade precisa ser introduzida

Discuta como a configuração do projeto foi feita na ferramenta de versionamento escolhida. Exponha como a gestão de tags, merges, commits e branches é realizada. Discuta também como a gestão de issues foi feita.


## Planejamento do projeto

###  Divisão de papéis

> Apresente a divisão de papéis entre os membros do grupo em cada Sprint. O desejável é que, em cada Sprint, o aluno assuma papéis diferentes na equipe. Siga o modelo do exemplo abaixo:

#### Sprint 1
- _Scrum master_: Guilherme Thiebaut

- Documentação: Ivan Barreto, Franklin Reis, Erik Alcantara, Juan Luciano, Gustavo Bernardo, Guilherme Thiebaut

- Protótipos: 
- Testes: 
- Documentação: Guilherme Thiebaut, Juan Cunha, Ivan Barreto, Erik Alcântara e Franklin Reis


#### Sprint 2
- _Scrum master_: Ivan Barreto
-  Documentação: Erik Alcantara, Juan Luciano, Franklin Reis, Gustavo Bernardo, Guilherme Thiebaut

   
#### Sprint 3
- _Scrum master_: Franklin Reis

- Documentação: Ivan Barreto, Juan Luciano, Guilherme Thiebaut

- Protótipos:  Erik Alcantara,  Gustavo Bernardo

#### Sprint 4
- _Scrum master_: Erik Alcantara,

- Documentação: Ivan Barreto, , Guilherme Thiebaut, Franklin Reis

- Protótipos: Juan Luciano, Gustavo Bernardo, Franklin Reis

#### Sprint 5
- _Scrum master_: Guilherme Thiebaut

- Documentação: Ivan Barreto, Franklin Reis, Gustavo Bernardo, Juan Luciano

- Protótipos: Erik Alcantara, Gustavo Bernardo, Ivan Barreto


###  Quadro de tarefas

> Apresente a divisão de tarefas entre os membros do grupo e o acompanhamento da execução, conforme o exemplo abaixo.

#### Sprint 1

Atualizado em: 11/03/2025

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| Erik       | Personas dos Funcionários  |    10/03/2025        | 13/03/2025 | ✔️    | 11/03/2025      |
| Erik       | Histórias de usuário 8/14  |    08/03/2025        | 13/03/2025 | ✔️    | 11/03/2025      |
| Erik       | Arquivo Citation  |    21/02/2025        | 13/03/2025 | ✔️    | 21/02/2025      |
| Erik       | Quadro Kanban  |    25/02/2025        | 13/03/2025 | ✔️    | 21/02/2025      |
| Franklin       | Template - Projeto Processo de Negócios |  08/03/2025    | 13/03/2025 | ✔️    | 13/03/2025       |
| Franklin       | Personas de Clientes    |   08/03/2025  | 13/03/2025 | ✔️      |   11/03/2025           |
| Franklin       | Histórias de usuário 6/14 |  08/03/2025   | 13/03/2025 | ✔️      |      09/03/2025          |
| Guilherme       | Slides Apresentação |  08/03/2025   | 13/03/2025 | ✔️      |      11/03/2025          |
| Guilherme       | Envio dos arquivos da tarefa |  13/03/2025   | 13/03/2025 | ✔️      |      13/03/2025          |
| Gustavo       | Arquivo Contexto |  02/03/2025   | 13/03/2025 | ✔️      |      02/03/2025          |
| Ivan        | Contato com cliente  |    01/01/2025        | 13/03/2025 | ✔️    | 28/02/2025      |
| Ivan        | Restrição do projeto  |    01/01/2025        | 13/03/2025 | ✔️    | 09/03/2025      |
| Ivan        | Requisitos funcionais 5/10  |    01/01/2025        | 13/03/2025 | ✔️    | 07/03/2025   |
| Ivan        | Requisitos não funcionais 5/10  |    01/01/2025        | 13/03/2025 | ✔️    | 07/03/2025    |
| Ivan        | Referências  |    01/01/2025        | 13/03/2025 | ✔️    | 13/03/2025      |
| Juan        | Requisitos não funcionais 5/10  |    09/03/2025        | 13/03/2025 | ✔️    | 09/03/2025    |
| Juan        | Requisitos funcionais 5/10 |    09/03/2025        | 13/03/2025 | ✔️    | 09/03/2025      |
| Juan       | Quadro Kanban  |    25/02/2025        | 13/03/2025 | ✔️    | 21/02/2025      |
| Ivan        | Contato com cliente  |    01/01/2024        | 13/03/2025 | ✔️    | 28/02/2025      |
| Ivan        | Restrição do projeto  |    01/01/2024        | 13/03/2025 | ✔️    | 09/03/2025      |
| Ivan        | Requisitos funcionais 5/10  |    01/01/2024        | 13/03/2025 | ✔️    | 07/03/2025   |
| Ivan        | Requisitos não funcionais 5/10  |    01/01/2024        | 13/03/2025 | ✔️    | 07/03/2025    |
| Ivan        | Referências  |    01/01/2024        | 13/03/2025 | ✔️    | 13/03/2025      |
| Juan        | Requisitos não funcionais 5/10  |    09/03/2025        | 13/03/2025 | ✔️    | 09/03/2025    |
| Juan        | Requisitos funcionais 5/10 |    09/03/2025        | 13/03/2025 | ✔️    | 09/03/2025      |
| Juan       | Quadro Kanban  |    25/02/2025        | 13/03/2025 | ✔️    | 21/02/2025      |

#### Sprint 2

Atualizado em: 21/04/2024

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| Franklin      | Preenchimento do Template - Projeto Processo de Negócios ( seção 3 )   | 07/04/2025     | 10/04/2025 | ✔️    | 10/04/2025      |
| Guilherme      | Modelagem dos Modelos AS - IS    | 30/03/2025     | 10/04/2025 | ✔️    |  10/04/2025               |
| Juan        | Preenchimento da modelagem dos processos de negócio  | 30/03/2025     | 10/04/2025 | ✔️     |  10/04/2025               |
| Ivan        | Metodologia  |  01/04/2025    | 10/04/2025 | ✔️    |  10/04/2025     |
| Erik      | Modelagem dos processos TO-BE  |  01/01/2025    | 10/04/2025 | ✔️    |  09/04/2025     |
| Gustavo      | Slides  |  08/04/2025    | 10/04/2025 | ✔️    |  10/04/2025     |
| Juan      | Visita a empresa |  01/04/2025    | 10/04/2025 | ✔️    |  01/04/2025     |
| Franklin     | Visita a empresa |  01/04/2025    | 10/04/2025 | ✔️    |  01/04/2025     |
| Ivan     | Visita a empresa |  01/04/2025    | 10/04/2025 | ✔️    |  01/04/2025     |

#### Sprint 3

Atualizado em: 08/05/2024

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| Franklin      | Criação do banco de dados no MySQL Workbench   | 28/04/2025     | 08/05/2025 | ✔️    | 08/05/2025      |
| Guilherme     | Realização do User Flow                        | 27/04/2025     | 08/05/2025 | ✔️    | 27/04/2025      |
| Guilherme     | Realização do Diagrama de Fluxo do Usuário     | 01/05/2025     | 08/05/2025 | ✔️    | 01/05/2025      |
| Juan          | Criação do banco de dados no MySQL Workbench   | 28/04/2025     | 08/05/2025 | ✔️    | 08/05/2025      |
| Ivan          | Criação do banco de dados no MySQL Workbench   | 28/04/2025     | 08/05/2025 | ✔️    | 08/05/2025      |
| Erik          | Criação dos wireframes  | 27/04/2025     | 08/05/2025 | ✔️    | 27/04/2025      |
| Gustavo       | Preenchimento do Template - Projeto Processo de Negócios ( seção 4 )   | 30/04/2025     | 08/05/2025 | ✔️    | 08/05/2025      |


#### Sprint 4

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| Franklin      | Modal de Agendamentos e relatório extensionista | 09/05/2025     | 05/06/2025 | ✔️    | 05/06/2025      |
| Guilherme     | Desenvolvimento do backend e banco de dados  | 09/05/2025     | 05/06/2025 | ✔️    | 27/04/2025      |
| Juan          | Tela Produtos | 23/05/2025     | 05/06/2025 | ✔️    | 04/06/2025      |
| Ivan          | Criacao do calendario e suas funcionalidades | 28/04/2025     | 05/05/2025 | ✔️    | 05/06/2025      |
| Erik          | Login e Cadastro   | 23/05/2025     | 05/06/2025 | ✔️    | 05/06/2025      |
| Gustavo       | Desenvolvimento da pagina de recuperar senha   | 23/05/2025     | 05/06/2025 | ✔️    | 05/06/2025      |



#### Sprint 5

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| Franklin      | Relatório extensionista   | 06/06/2025     | 29/06/2025 | ✔️    | 28/06/2025      |
| Guilherme     | Desenvolvimento do backend e banco de dados   | 06/06/2025     | 27/06/2025 | ✔️    | 27/04/2025      |
| Juan          | Tela Produtos / React | 14/06/2025 | 27/06/2025 | ✔️    | 17/06/2025      |
| Juan          | Organização dos códigos / pastas | 24/06/2025     | 27/06/2025 | ✔️    | 24/06/2025      |
| Juan          | Auxilo na organização do GitHub conforme o solicitado | 26/06/2025     | 27/06/2025 | ✔️    | 26/06/2025      |
| Ivan          |  criacap da tela info produtos e suas funcionalidades  | 28/04/2025     | 27/06/2025 | ✔️    | 08/05/2025      |
| Ivan          |  teste da aplicacao com o cliente em situacao real | 28/04/2025     | 27/06/2025 | ✔️    | 08/05/2025      |
| Erik          | Painel Administrador  | 10/06/2025  |  27/06/2025  |  ✔️   |  22/06/2025    |
| Gustavo       | Desenvolvimento da pagina de adminstrador      | 10/06/2025     | 27/06/2025 | ✔️    | 22/06/2025      |
| Gustavo       | Organização do GitHub      | 10/06/2025     | 27/06/2025 | ✔️    | 22/06/2025      |


Legenda:
- ✔️: terminado
- 📝: em execução
- ⌛: atrasado
- ❌: não iniciado

## Relação de ambientes de trabalho

Os artefatos do projeto são desenvolvidos a partir de diversas plataformas. Todos os ambientes e frameworks utilizados no desenvolvimento da aplicação estão listados na seção abaixo.

### Ferramentas

| Ambiente                            | Plataforma                         | Link de acesso                         |
|-------------------------------------|------------------------------------|----------------------------------------|
| Repositório de código fonte         | GitHub                             | [http://....](https://github.com/ICEI-PUC-Minas-PCO-ADS-TI/2025-1-p2-tiapn-NaRegua.git) |
| Documentos do projeto               | GitHub                             | [http://....](https://github.com/ICEI-PUC-Minas-PCO-ADS-TI/2025-1-p2-tiapn-NaRegua/tree/79873f8382367f0415cbd3bc8d136cb9556559c8/docs) |
| Projeto de interface                | Figma                              | [http://.... ](https://www.figma.com/design/6HH3mm79LVrUvsE6PxsAQN/Wireframes-Kit---Free-wireframing-Websites-and-SaaS-UI-UX--Community-?node-id=3102-1990&p=f&t=UNemLPzNZTzvM9LU-0) |
| Gerenciamento do projeto            | GitHub Projects                    | [https://](github.com/ICEI-PUC-Minas-PCO-ADS-TI/2025-1-p2-tiapn-NaRegua/projects?query=is%3Aopen) |
| Hospedagem                          | Vercel                             | http://....                            |
| Modelagem                      | Bizagi                            | https://www.bizagi.com/pt                            |
