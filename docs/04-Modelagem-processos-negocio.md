# Modelagem dos processos de negócio

<span style="color:red">Pré-requisitos: <a href="02-Especificacao.md"> Especificação do projeto</a></span>

## Modelagem da situação atual (Modelagem AS IS)

Contextualização do Problema
Atualmente, o processo de agendamento dos serviços oferecidos pela barbearia — como corte de cabelo, barba e sobrancelha — é realizado de forma manual, seja presencialmente ou por meio de mensagens diretas ao barbeiro. Essa abordagem, embora funcional, demanda tempo e atenção constantes, além de estar suscetível a falhas de comunicação, sobreposições de horários e dificuldade de controle da agenda.

Proposta de Solução
Com base nesse cenário, propõe-se o desenvolvimento e implementação de um sistema digital de agendamento, com o objetivo de automatizar e otimizar o gerenciamento dos serviços prestados. A solução permitirá que os clientes realizem agendamentos de maneira prática e autônoma, por meio de uma interface amigável, acessível a qualquer momento.

Benefícios Esperados
A adoção do sistema visa, sobretudo, a agilização e organização dos atendimentos, proporcionando ao barbeiro um ganho significativo na gestão do tempo. A longo prazo, espera-se que essa melhoria operacional contribua para o aumento da produtividade e, consequentemente, para a ampliação da carteira de clientes, possibilitando um atendimento mais eficiente e profissional.

 ![AS IS](https://github.com/user-attachments/assets/d3836199-07c1-4cc5-a50e-a7e98b13b470)

**Início**: O cliente manda mensagem (telefone, e-mail, chat) para agendar o horário.

**Verificação**: O Barbeiro verificar a disponibilidade.

**Confirmação**: O barbeiro confirmar a disponibilidade se sim/não. Sim, ele agenda um horário - Não, ira agenda para uma outra data.

**Serviços**: O cliente vai até a barbearia. O barbeiro executar o serviço desejado pelo cliente.

**Encerramento**: O cliente realiza o pagamento.

**Fim**: Serviço finalizado. 

Com a aplicação do projeto definida visamos ganhos com a automatização do serviço prestado pela empresa.

## Descrição geral da proposta (Modelagem TO BE)

Indentificado que a empresa possui uma segunda demanda de serviço que poderia está causando um pequeno gargalo no processo de todo atendimento. Podendo gerar uma pequena demanda de tempo a mais nos demais serviços prestados. Foi elaborado uma ideia para que seja condesado o processo para a solução do gargalo. 

![TO BE](https://github.com/user-attachments/assets/f9e58658-4773-481b-84e8-003039748046)

**Mudanças**:
- Cliente entra na loja.

- Escolhe o produto desejado.

- Compra o produto.

**Novo fluxo**:

- Cliente entra no site e escolhe os produtos.

- Selecionar o produto.

- Confirma o produto.

- O barbeiro receber o pedido, e prepara o pedido.

- Cliente vai a barbearia e realiza o pagamento.

- Faz a retirada do produto.

**Atendimento encerrado.**


## Modelagem dos processos

[PROCESSO 1 - CORTE DE CABELO](./processes/processo-1-nome-do-processo.md "Detalhamento do processo 1.")

[PROCESSO 2 - COMPRAR PRODUTOS](./processes/processo-2-nome-do-processo.md "Detalhamento do processo 2.")


## Indicadores de desempenho


| **Indicador** | **Objetivos** | **Descrição** | **Fonte de dados** | **Fórmula de cálculo** |
| ---           | ---           | ---           | ---             | ---             |
| **Taxa de comparecimento** | Avaliar presença dos clientes nos agendamentos | Mede o % de clientes que comparecem aos horários marcados | Tabela Agenda | (Número de comparecimentos / Número total de agendamentos) |
| **Tempo médio de agendamento** | Avaliar agilidade entre solicitação e confirmação de horário| Tempo médio entre o envio da mensagem e a confirmação de horário | Tabela Agenda | (Soma dos tempos entre solicitação e marcação / Total de agendamentos) |
| **Taxa de conversão de visualização em compra** | Medir a eficiência do site em transformar interesse em compra | % de clientes que visualizaram e concluíram uma compra | Tabela Pedidos, clientes | (Número de compras / Número de visualizações de produtos) |
| **Tempo médio de processamento do pedido** | Medir a eficiência no preparo do pedido | Tempo entre a confirmação da compra e o preparo completo do pedido | Tabela Pedidos | (Soma dos tempos de processamento / Total de pedidos) |
| **Taxa de pedidos entregues corretamente** | Garantir a qualidade no processo de entrega | Mede o % de pedidos entregues sem erros ou devoluções | Tabela Pedidos | (Pedidos corretos / Total de pedidos entregues) |
