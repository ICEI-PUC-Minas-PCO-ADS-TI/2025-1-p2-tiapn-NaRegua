# Especificação do projeto

<span style="color:red">Pré-requisitos: <a href="01-Contexto.md"> Documentação de contexto</a></span>



## Personas

_Taíca tem 32 anos, é dona da Barbearia da Cuíca e gerencia tanto o atendimento aos clientes quanto a equipe de barbeiros. Ela precisa de um sistema que o ajude a visualizar rapidamente todos os agendamentos do dia e a controlar os horários de atendimento da equipe, garantindo que os clientes só possam marcar dentro da disponibilidade real. Com uma rotina corrida, ela busca uma solução simples e prática para organizar melhor o fluxo de trabalho e evitar problemas na agenda._

_Leleco tem 25 anos, é barbeiro funcionário na Barbearia da Cuíca e tem uma agenda cheia de atendimentos ao longo do dia. Para se organizar melhor, ele precisa de um sistema onde possa visualizar facilmente seus agendamentos, registrar os serviços concluídos e bloquear horários quando necessário, evitando conflitos ou sobrecarga de trabalho. Como preza pela qualidade do atendimento, ele busca mais autonomia para gerenciar sua rotina sem depender de anotações manuais ou da secretária._

_Jéssica tem 22 anos, é secretária da Barbearia da Cuíca e responsável por organizar os agendamentos e atender os clientes. No dia a dia, ela precisa de um sistema que facilite o agendamento, remarcação e cancelamento de horários, além de permitir o cadastro de clientes para agilizar futuras marcações. Com um grande volume de atendimentos, ela busca uma solução prática que reduza erros e torne a gestão da agenda mais eficiente._

_Bento Dias tem 16 anos, é cliente fiel de sua barberia e corta o cabelo em um espaço de 2 a 3 semanas. Um sistema de agendamentos seria essencial para Bento, porque garantiria o seu corte de cabelo sempre que ele efetuasse a marcação no site, ao contrário do que tem acontecido com ele atualmente ao combinar tentar combinar horários via WhatsApp com o seu barbeiro. Bento já passou pela experiência de ser atendido mais de uma vez "tempos" depois do horário estabelecido, inclusive teve até que abrir mão de cortar o cabelo em algumas dessas ocasiões._

_João Lucas tem 31 anos, é casado e possui um filho com sua esposa. João corta o cabelo regurlamente e as vezes leva consigo seu filho para acompanhá-lo e cortar o cabelo também. Infelizmente, em alguma dessas idas com seu filho à barberia, João havia reservado o assento de carro para seu garoto, mas no momento de seu atendimento ele não pôde ser atendido lá, por falta de organização do barbeiro em relação a reserva desse assento, o que sempre gera grandes estresses para a criança. Um sistema de agendamentos permitirá que o barbeiro faça uma gestão melhor desse espaço e assim satisfaça todos os seus clientes, desde adultos até as crianças._

_Luis Reis tem 31 anos, e trabalha com manuntenção de elevadores. Luís vive bastante ocupado no seu dia a dia, seu celular não possui apenas uma rede de contatos pessoais, mas profissionais também. Além disso, seu trabalho demanda muito do seu tempo, atenção e disponibilidade, o que o impede de conversar com seu barbeiro via WhatsApp para agendar um corte de cabelo ou barba. Um sistema de agendamentos trará facilidade e agilidade para sua vida nos momentos em que ele desejar marcar um atendimento na barbearia._


## Histórias de usuários

Com base na análise das personas, foram identificadas as seguintes histórias de usuários:

|EU COMO... `PERSONA`| QUERO/PRECISO ... `FUNCIONALIDADE` |PARA ... `MOTIVO/VALOR`                 |
|--------------------|------------------------------------|----------------------------------------|
| Pai  | Reservar a cadeira infantil para meu filho com confiança.   |   Meu filho se dispõe com mais boa vontade a cortar o cabelo sentado nela.  |
|  Criança     |  Ir á barbearia e encontrar a cadeira de carro vazia.                 |Para que eu corte o cabelo nela.  |
|  Jovem     | Cortar o cabelo no horário agendado.               |Tenho outros compromissos na agenda após o corte e não gostaria de me atrasar para eles. |
|  Jovem   |  Cortar o cabelo exatamente no dia que agendei.                |Pois não quero ser realocado frequentemente ou ficar dependendo de um encaixe sempre. |
|  Trabalhador     | Agendar os meus cortes de cabelo e barba com mais facilidade.               | Trabalho muito e não tenho tempo para ficar conversando via Whatsapp com o barbeiro até confirmar um horário.  |
|  Trabalhador     | Um sistema que me permita escolher os tipos de atendimento que desejo.              |Às vezes, quero fazer somente a barba, outras vezes somente o cabelo, e em outras ocasiões ambas as coisas.   |
|  Dona da Barbearia | Um painel para poder visualizar todos o agendamentos do dia. | Para conseguir gerenciar melhor o fluxo de clientes. |
| Dona da Barbearia | Cadastrar e editar os horários de atendimento da minha equipe. | Para o sistema permitir agendamentos dentro da nossa disponibilidade. |
| Barbeiro | Visualizar minha agenda de atendimentos. | Conseguir me organizar melhor e oferecer um serviço de qualidade. |
| Barbeiro | Registrar a conclusão dos serviços prestados. | Para manter o controle sobre atendimentos realizados. |
| Barbeiro | Marcar um horário com indisponível. | Fazendo com que clientes não consigam agendar nesse período quando eu precisar me ausentar. |
| Secretária da Barbearia | Agendar horários. | Facilitando a organização dos atendimentos. | 
| Secretária da Barbearia | Remarcar ou cancelar agendamentos de clientes. | Para oferecer flexibilidade no atendimento. |
| Secretária da Barbearia | Cadastrar clientes no sistema. | Para que seja mais rápido fazer agendamentos futuros. |


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


## Restrições

Enumere as restrições à sua solução. Lembre-se de que as restrições geralmente limitam a solução candidata.

O projeto está restrito aos itens apresentados na tabela a seguir.

|ID| Restrição                                             |
|--|-------------------------------------------------------|
|001| O projeto deverá ser entregue dentro do prazo até o final do semestre |
|002| O progeto deverá ser feito e apresentado por todos os integrantes em tempo habil       |
|003| O cliente devera participar nas decisões de alteracões visuais do projeto       |
|004| Para a organização da produção do projeto devera ser utilizado obrigatoriamente o quadro Kanba      |
|005| Os papeis e funções de cada integrante deverão ser seguidos, ordenadamente para facilitar a integração e producao dos artefatos     |
|006| Todos as fontes e links utilizados nas pesquisas de desenvolvimento devem ser citadas nas referências do projeto       |
|007| Os integrantes do grupo deverão desenvolver as personas e histórias de usuario apartir da aplicação mirro      |



## Diagrama de casos de uso

![docs/images/diagrama_fluxo.jpg]
