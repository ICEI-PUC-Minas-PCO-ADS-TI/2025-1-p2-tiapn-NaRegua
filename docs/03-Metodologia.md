
# Metodologia

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

> **Links úteis**:
> - [Tutorial GitHub](https://guides.github.com/activities/hello-world/)
> - [Git e GitHub](https://www.youtube.com/playlist?list=PLHz_AreHm4dm7ZULPAmadvNhH6vk9oNZA)
> - [Comparando fluxos de trabalho](https://www.atlassian.com/br/git/tutorials/comparing-workflows)
> - [Understanding the GitHub flow](https://guides.github.com/introduction/flow/)
> - [The gitflow workflow - in less than 5 mins](https://www.youtube.com/watch?v=1SXpE08hvGs)

## Planejamento do projeto

###  Divisão de papéis

> Apresente a divisão de papéis entre os membros do grupo em cada Sprint. O desejável é que, em cada Sprint, o aluno assuma papéis diferentes na equipe. Siga o modelo do exemplo abaixo:

#### Sprint 1
- _Scrum master_: Guilherme Thiebaut
- Protótipos: AlunoY
- Testes: AlunoK
- Documentação: Ivan Barreto, Franklin Reis, Erik Alcantara, Juan Luciano, Gustavo Bernardo, Guilherme Thiebaut

#### Sprint 2
- _Scrum master_: Ivan Barreto
-  Documentação: Erik Alcantara, Juan Luciano, Franklin Reis, Gustavo Bernardo, Guilherme Thiebaut

###  Quadro de tarefas

> Apresente a divisão de tarefas entre os membros do grupo e o acompanhamento da execução, conforme o exemplo abaixo.

#### Sprint 1

Atualizado em: 21/04/2024

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

#### Sprint 2

Atualizado em: 21/04/2024

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| Franklin      | Preenchimento do Template - Projeto Processo de Negócios ( seção 3 )   | 07/04/2025     | 10/04/2025 | ✔️    | 10/04/2025      |
| Guilherme      | Modelagem dos Modelos AS - IS    | 30/03/2025     | 10/04/2025 | ✔️    |  10/04/2025               |
| Juan        | Preenchimento da modelagem dos processos de negócio  | 30/03/2025     | 10/04/2025 | ✔️     |  10/04/2025               |
| Ivan B.       | Metodologia  |  01/04/2025    | 10/04/2025 | ✔️    |  10/04/2025     |
| Erik      | Modelagem dos processos TO-BE  |  01/01/2025    | 10/04/2025 | ✔️    |  09/04/2025     |
| Gustavo      | Slides  |  08/04/2025    | 12/04/2025 | ✔️    |  10/04/2025     |
| Juan      | Visita a empresa |  01/04/2025    | 10/04/2025 | ✔️    |  01/04/2025     |
| Franklin     | Visita a empresa |  01/04/2025    | 10/04/2025 | ✔️    |  01/04/2025     |
| Ivan B.    | Visita a empresa |  01/04/2025    | 10/04/2025 | ✔️    |  01/04/2025     |


Legenda:
- ✔️: terminado
- 📝: em execução
- ⌛: atrasado
- ❌: não iniciado


> **Links úteis**:
> - [11 passos essenciais para implantar Scrum no seu projeto](https://mindmaster.com.br/scrum-11-passos/)
> - [Scrum em 9 minutos](https://www.youtube.com/watch?v=XfvQWnRgxG0)
> - [Os papéis do Scrum e a verdade sobre cargos nessa técnica](https://www.atlassian.com/br/agile/scrum/roles)

### Processo

Coloque informações sobre detalhes da implementação do Scrum seguido pelo grupo. O grupo deverá fazer uso do recurso de gerenciamento de projeto oferecido pelo GitHub, que permite acompanhar o andamento do projeto, a execução das tarefas e o status de desenvolvimento da solução.
 
> **Links úteis**:
> - [Planejamento e gestão ágil de projetos](https://pucminas.instructure.com/courses/87878/pages/unidade-2-tema-2-utilizacao-de-ferramentas-para-controle-de-versoes-de-software)
> - [Sobre quadros de projeto](https://docs.github.com/pt/issues/organizing-your-work-with-project-boards/managing-project-boards/about-project-boards)
> - [Project management, made simple](https://github.com/features/project-management/)
> - [Como criar backlogs no GitHub](https://www.youtube.com/watch?v=RXEy6CFu9Hk)
> - [Tutorial slack](https://slack.com/intl/en-br/)

## Relação de ambientes de trabalho

Os artefatos do projeto são desenvolvidos a partir de diversas plataformas. Todos os ambientes e frameworks utilizados no desenvolvimento da aplicação estão listados na seção abaixo.

### Ferramentas

Liste todas as ferramentas que foram empregadas no projeto, justificando a escolha delas, sempre que possível.


Exemplo: os artefatos do projeto são desenvolvidos a partir de diversas plataformas e a relação dos ambientes com seu respectivo propósito é apresentada na tabela que se segue.

| Ambiente                            | Plataforma                         | Link de acesso                         |
|-------------------------------------|------------------------------------|----------------------------------------|
| Repositório de código fonte         | GitHub                             | http://....                            |
| Documentos do projeto               | GitHub                             | http://....                            |
| Projeto de interface                | Figma                              | http://....                            |
| Gerenciamento do projeto            | GitHub Projects                    | http://....                            |
| Hospedagem                          | Vercel                             | http://....                            |
| Modelagem                      | Bizagi                            | https://www.bizagi.com/pt                            |
