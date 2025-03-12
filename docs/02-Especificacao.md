# Especificação do projeto

<span style="color:red">Pré-requisitos: <a href="01-Contexto.md"> Documentação de contexto</a></span>

Definição do problema e ideia de solução a partir da perspectiva do usuário. É composta pela definição do  diagrama de personas, histórias de usuários, requisitos funcionais e não funcionais além das restrições do projeto.

Apresente uma visão geral do que será abordado nesta parte do documento, enumerando as técnicas e/ou ferramentas utilizadas para realizar a especificações do projeto.

## Personas

Exemplo: _Pedro Paulo tem 26 anos, é arquiteto recém-formado e autônomo. Pensa em se desenvolver profissionalmente por meio de um mestrado fora do país, pois adora viajar, é solteiro e sempre quis fazer um intercâmbio. Está buscando uma agência que o ajude a encontrar universidades na Europa que aceitem alunos estrangeiros._

Enumere e detalhe as personas da sua solução. Para tanto, baseie-se tanto nos documentos disponibilizados na disciplina e/ou nos seguintes links:


## Histórias de usuários

Com base na análise das personas, foram identificadas as seguintes histórias de usuários:

|EU COMO... `PERSONA`| QUERO/PRECISO ... `FUNCIONALIDADE` |PARA ... `MOTIVO/VALOR`                 |
|--------------------|------------------------------------|----------------------------------------|
| Pai  | Reservar o assento de carro para meu filho com segurança e confiança     |   Meu filho se dispõe com mais boa vontade a cortar o cabelo sentado nela.  |
|  Criança     |  Ir á barbearia e encontrar a cadeira de carro vazia                 |Para que eu corte o cabelo nela.  |
|  Jovem     | Cortar o cabelo no horário agendado               |Tenho outros compromissos na agenda após o corte e não gostaria de me atrasar para eles. |
|  Jovem   |  Cortar o cabelo exatamente no dia que agendei                |Pois não quero ser realocado frequentemente ou ficar dependendo de um encaixe sempre. |
|  Trabalhador     | Agendar os meus cortes de cabelo e barba com mais facilidade               | Trabalho muito e não tenho tempo para ficar conversando via Whatsapp com o barbeiro até confirmar um horário.  |
|  Trabalhador     | Um sistema que me permita escolher os tipos de atendimento que desejo              |Às vezes, quero fazer somente a barba, outras vezes somente o cabelo, e em outras ocasiões ambas as coisas.   |
|  Dono da Barbearia | Um painel para poder visualizar todos o agendamentos do dia. | Para conseguir gerenciar melhor o fluxo de clientes. |
| Dono da Barbearia | Cadastrar e editar os horários de atendimento da minha equipe. | Para o sistema permitir agendamentos dentro da nossa disponibilidade. |
| Barbeiro | Visualizar minha agenda de atendimentos. | Conseguir me organizar melhor e oferecer um serviço de qualidade. |
| Barbeiro | Registrar a conclusão dos serviços prestados. | Para manter o controle sobre atendimentos realizados. |
| Barbeiro | Marcar um horário com indisponível. | Fazendo com que clientes não consigam agendar nesse período quando eu precisar me ausentar. |
| Secretária da Barbearia | Agendar horários. | Facilitando a organização dos atendimentos. | 
| Secretária da Barbearia | Remarcar ou cancelar agendamentos de clientes. | Para oferecer flexibilidade no atendimento. |
| Secretária da Barbearia | Cadastrar clientes no sistema. | Para que seja mais rápido fazer agendamentos futuros. |


## Requisitos

As tabelas a seguir apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto. Para determinar a prioridade dos requisitos, aplique uma técnica de priorização e detalhe como essa técnica foi aplicada.

### Requisitos funcionais

|ID    | Descrição do Requisito  | Prioridade |
|------|-----------------------------------------|----|
|RF-001| Permitir que o usuário cadastre tarefas | ALTA | 
|RF-002| Emitir um relatório de tarefas no mês   | MÉDIA |

### Requisitos não funcionais

|ID     | Descrição do Requisito  |Prioridade |
|-------|-------------------------|----|
|RNF-001| O sistema deve ser responsivo para rodar em dispositivos móveis | MÉDIA | 
|RNF-002| Deve processar as requisições do usuário em no máximo 3 segundos |  BAIXA | 


## Restrições

|ID| Restrição                                             |
|--|-------------------------------------------------------|
|001| O projeto deverá ser entregue até o final do semestre |
|002| O custo total do projeto não deve exceder o orçamento definido       |

## Diagrama de casos de uso

O diagrama de casos de uso é o próximo passo após a elicitação de requisitos. Ele utiliza um modelo gráfico e uma tabela com as descrições sucintas dos casos de uso e dos atores. O diagrama contempla a fronteira do sistema e o detalhamento dos requisitos funcionais, com a indicação dos atores, casos de uso e seus relacionamentos.

As referências abaixo irão auxiliá-lo na geração do artefato “diagrama de casos de uso”.

> **Links úteis**:
> - [Criando casos de uso](https://www.ibm.com/docs/pt-br/engineering-lifecycle-management-suite/design-rhapsody/10.0?topic=cases-creating-use)
> - [Como criar diagrama de caso de uso: tutorial passo a passo](https://gitmind.com/pt/fazer-diagrama-de-caso-uso.html/)
> - [Lucidchart](https://www.lucidchart.com/)
> - [Astah](https://astah.net/)
> - [Diagrams](https://app.diagrams.net/)
