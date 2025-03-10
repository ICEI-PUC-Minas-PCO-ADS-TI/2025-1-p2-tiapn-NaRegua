# Especificação do projeto

<span style="color:red">Pré-requisitos: <a href="01-Contexto.md"> Documentação de contexto</a></span>

Definição do problema e ideia de solução a partir da perspectiva do usuário. É composta pela definição do  diagrama de personas, histórias de usuários, requisitos funcionais e não funcionais além das restrições do projeto.

Apresente uma visão geral do que será abordado nesta parte do documento, enumerando as técnicas e/ou ferramentas utilizadas para realizar a especificações do projeto.

## Personas

Exemplo: _Pedro Paulo tem 26 anos, é arquiteto recém-formado e autônomo. Pensa em se desenvolver profissionalmente por meio de um mestrado fora do país, pois adora viajar, é solteiro e sempre quis fazer um intercâmbio. Está buscando uma agência que o ajude a encontrar universidades na Europa que aceitem alunos estrangeiros._

Enumere e detalhe as personas da sua solução. Para tanto, baseie-se tanto nos documentos disponibilizados na disciplina e/ou nos seguintes links:

> **Links úteis**:
> - [Rock content](https://rockcontent.com/blog/personas/)
> - [Hotmart](https://blog.hotmart.com/pt-br/como-criar-persona-negocio/)
> - [O que é persona?](https://resultadosdigitais.com.br/blog/persona-o-que-e/)
> - [Persona x público-alvo](https://flammo.com.br/blog/persona-e-publico-alvo-qual-a-diferenca/)
> - [Mapa de empatia](https://resultadosdigitais.com.br/blog/mapa-da-empatia/)
> - [Mapa de stalkeholders](https://www.racecomunicacao.com.br/blog/como-fazer-o-mapeamento-de-stakeholders/)
>
Lembre-se que você deve ser enumerar e descrever precisamente e personalizada todos os clientes ideais que sua solução almeja.

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

Apresente aqui as histórias de usuários que são relevantes para o projeto da sua solução. As histórias de usuários consistem em uma ferramenta poderosa para a compreensão e elicitação dos requisitos funcionais e não funcionais da sua aplicação. Se possível, agrupe as histórias de usuários por contexto, para facilitar consultas recorrentes a esta parte do documento.

> **Links úteis**:
> - [Histórias de usuários com exemplos e template](https://www.atlassian.com/br/agile/project-management/user-stories)
> - [Como escrever boas histórias de usuário (user stories)](https://medium.com/vertice/como-escrever-boas-users-stories-hist%C3%B3rias-de-usu%C3%A1rios-b29c75043fac)
> - [User stories: requisitos que humanos entendem](https://www.luiztools.com.br/post/user-stories-descricao-de-requisitos-que-humanos-entendem/)
> - [Histórias de usuários: mais exemplos](https://www.reqview.com/doc/user-stories-example.html)
> - [9 common user story mistakes](https://airfocus.com/blog/user-story-mistakes/)

## Requisitos

As tabelas a seguir apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto. Para determinar a prioridade dos requisitos.

### Requisitos funcionais

|ID    | Descrição do Requisito  | Prioridade |
|------|-----------------------------------------|----|
|RF-001| Permite o cadastro de usuários | ALTA | 
|RF-002| Permite o cadastro do Administrador | ALTA |
|RF-003| Recuperação de senha | ALTA |
|RF-004| Agendamento de horário | ALTA |
|RF-005| Cancelamento/Regandamento de horário | ALTA |
|RF-006| Barra de pesquisa | ALTA |
|RF-007| Notificação de aberto ou fechado | ALTA |
|RF-008| Avaliação do serviço | ALTA |
|RF-009| Perfil de usuário | ALTA |

### Requisitos não funcionais

|ID     | Descrição do Requisito  |Prioridade |
|-------|-------------------------|----|
|RNF-001| Disponibilizar uma API para redirecionamento para o WhatsApp. | MÉDIA | 
|RNF-002| Interface intuitiva e responsiva para facilitar o uso. |  ALTA |
|RNF-003| O sistema deve ficar 24h por dia sem interrupções. | ALTA | 
|RNF-004| O sistema deve ser compatível a todos os navegadores e dispositivos. |  ALTA | 
|RNF-005| O sistema deve armazenar e recuparar dados conforme as necessidades. | MÉDIA | 
|RNF-006| A legibilidade do código, modularidade e documentação. |  ALTA | 
|RNF-007| Os padrões estabelecidos pela empresa (Cliente). | ALTA | 
|RNF-008| Integração o sistema deve se comunicar com outras aplicações. |  MÉDIA | 

Com base nas histórias de usuários, enumere os requisitos da sua solução. Classifique esses requisitos em dois grupos:

- [Requisitos funcionais
 (RF)](https://pt.wikipedia.org/wiki/Requisito_funcional):
 correspondem a uma funcionalidade que deve estar presente na
  plataforma (ex: cadastro de usuário).
- [Requisitos não funcionais
  (RNF)](https://pt.wikipedia.org/wiki/Requisito_n%C3%A3o_funcional):
  correspondem a uma característica técnica, seja de usabilidade,
  desempenho, confiabilidade, segurança ou outro (ex: suporte a
  dispositivos iOS e Android).

Lembre-se de que cada requisito deve corresponder a uma e somente uma característica-alvo da sua solução. Além disso, certifique-se de que todos os aspectos capturados nas histórias de usuários foram cobertos.


> **Links úteis**:
> - [O que são requisitos funcionais e requisitos não funcionais?](https://codificar.com.br/requisitos-funcionais-nao-funcionais/)
> - [Entenda o que são requisitos de software, a diferença entre requisito funcional e não funcional, e como identificar e documentar cada um deles](https://analisederequisitos.com.br/requisitos-funcionais-e-requisitos-nao-funcionais-o-que-sao/)

## Restrições

Enumere as restrições à sua solução. Lembre-se de que as restrições geralmente limitam a solução candidata.

O projeto está restrito aos itens apresentados na tabela a seguir.

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
