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

Identificação de Gargalo no Processo
Durante a análise do funcionamento atual da barbearia, foi identificada uma segunda demanda de serviço que pode estar contribuindo para um gargalo no fluxo de atendimento. Essa demanda adicional, embora relevante, tem potencial para gerar atrasos e impactar negativamente o tempo de execução dos demais serviços oferecidos.

Proposta de Otimização
Diante desse cenário, foi elaborada uma proposta de melhoria visando condensar e otimizar esse processo secundário, com o intuito de eliminar o gargalo identificado. A solução proposta busca integrar essa etapa ao fluxo do sistema de agendamento principal, de modo a minimizar o impacto no tempo total de atendimento e garantir maior fluidez na operação do estabelecimento.

Benefícios Esperados
Com a aplicação dessa solução, espera-se uma redução do tempo ocioso e das sobreposições de horários, permitindo uma gestão mais eficiente dos serviços e melhor aproveitamento da agenda do barbeiro. Além disso, essa melhoria pode contribuir para uma experiência mais satisfatória por parte do cliente, ao reduzir o tempo de espera e aumentar a previsibilidade dos atendimentos. 

![TO BE](https://github.com/user-attachments/assets/f9e58658-4773-481b-84e8-003039748046)

**Mudanças**:
- Cliente entra na loja.

- Escolhe o produto desejado.

- Compra o produto.

**Novo fluxo**:

1. Agendamento de Horário
      Fluxo principal:
      O cliente acessa a plataforma, seleciona o serviço desejado, escolhe o profissional (se aplicável) e define data e horário disponíveis. O sistema confirma o agendamento e envia uma notificação.
    
       Exceções/Falhas possíveis:
       
       ✅ Conflito de horário: dois usuários tentam agendar no mesmo horário simultaneamente.
       → Solução: uso de bloqueio de transação no banco de dados ou verificação em tempo real antes da confirmação.
       
       ⚠️ Horário indisponível após seleção: o horário ficou indisponível no tempo entre a seleção e a confirmação.
       → Solução: revalidação do horário antes de confirmar e notificação ao usuário.
       
       ❌ Falha de conexão com servidor ou banco de dados: impossibilita a finalização do agendamento.
       → Solução: exibir mensagem amigável, logar o erro e permitir tentativa posterior.

2. Cancelamento ou Reagendamento
       Fluxo principal:
       O cliente pode cancelar ou reagendar um serviço até um limite de tempo antes do horário marcado.
       
       Exceções/Falhas possíveis:
       
       ⚠️ Tentativa de cancelamento fora do prazo permitido
       → Solução: exibir mensagem informando que a ação não pode ser realizada.
       
       ❌ Reagendamento para horário já ocupado
       → Solução: bloquear horários ocupados e sugerir horários alternativos.

3. Cadastro e Autenticação de Usuário
       Fluxo principal:
       O cliente realiza cadastro com dados básicos (nome, telefone, e-mail) e autentica-se para agendar.
       
       Exceções/Falhas possíveis:
       
       ❌ Dados inválidos ou já cadastrados
       → Solução: validações no frontend/backend com mensagens claras (e-mail em uso, número inválido, etc).
       
       🔐 Erro na autenticação
       → Solução: bloquear tentativa após várias falhas, oferecer recuperação de senha e notificar acesso suspeito.

4. Disponibilidade de Profissionais
       Fluxo principal:
       O sistema exibe horários disponíveis com base na agenda do barbeiro.
       
       Exceções/Falhas possíveis:
       
       ⚠️ Barbeiro marca folga ou falta repentina
       → Solução: painel de controle para bloqueio manual de horários e envio de notificação aos clientes afetados.
       
       ❌ Erro ao carregar disponibilidade (ex.: falha no back-end)
       → Solução: fallback para carregamento padrão e registro do erro para correção posterior.

5. Notificações e Lembretes
       Fluxo principal:
       O sistema envia confirmações, lembretes e atualizações via e-mail ou mensagem.
       
       Exceções/Falhas possíveis:
       
       ❌ Falha no envio de notificações (API de terceiros fora do ar, erro de integração)
       → Solução: reenvio automático, fallback para e-mail se SMS falhar e monitoramento da fila de envio.

**Atendimento encerrado.**


## Modelagem dos processos

[PROCESSO 1 - CORTE DE CABELO AS-IS](./processes/Processo-1-AS-IS-CORTE-DE-CABELO.md "Detalhamento do processo 1.")

[PROCESSO 2 - CORTE DE CABELO TO-BE](./processes/Processo-2-TO-BE-CORTE-DE-CABELO.md "Detalhamento do processo 2.")

[PROCESSO 1 - COMPRAR PRODUTOS AS-IS](./processes/Processo-1-AS-IS-COMPRAR-PRODUTOS.md "Detalhamento do processo 1.")

[PROCESSO 2 - CCOMPRAR PRODUTOS TO-BE](./processes/Processo-2-TO-BE-COMPRAR-PRODUTOS.md "Detalhamento do processo 2.")



## Indicadores de desempenho


| **Indicador** | **Objetivos** | **Descrição** | **Fonte de dados** | **Fórmula de cálculo** |
| ---           | ---           | ---           | ---             | ---             |
| **Taxa de comparecimento** | Avaliar presença dos clientes nos agendamentos | Mede o % de clientes que comparecem aos horários marcados | Tabela Agenda | (Número de comparecimentos / Número total de agendamentos) |
| **Tempo médio de agendamento** | Avaliar agilidade entre solicitação e confirmação de horário| Tempo médio entre o envio da mensagem e a confirmação de horário | Tabela Agenda | (Soma dos tempos entre solicitação e marcação / Total de agendamentos) |
| **Taxa de conversão de visualização em compra** | Medir a eficiência do site em transformar interesse em compra | % de clientes que visualizaram e concluíram uma compra | Tabela Pedidos, clientes | (Número de compras / Número de visualizações de produtos) |
| **Tempo médio de processamento do pedido** | Medir a eficiência no preparo do pedido | Tempo entre a confirmação da compra e o preparo completo do pedido | Tabela Pedidos | (Soma dos tempos de processamento / Total de pedidos) |
| **Taxa de pedidos entregues corretamente** | Garantir a qualidade no processo de entrega | Mede o % de pedidos entregues sem erros ou devoluções | Tabela Pedidos | (Pedidos corretos / Total de pedidos entregues) |
