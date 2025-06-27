## 3.3.1 Processo 1 – CORTE DE CABELO/ATENDIMENTO DO CLIENTE

1. Agendamento Ineficiente: O processo é manual e reativo, com o cliente se deslocando fisicamente sem confirmação prévia, gerando espera e possível perda de clientes.

2. Processos Desconectados: O agendamento e a chegada do cliente parecem ocorrer em paralelo e de forma assíncrona, causando atritos e desorganização.

3. Gestão: Quando não há horário disponível, o processo simplesmente se encerra para o cliente, resultando em perda de oportunidades de negócio.

4. Coleta Tardia: A escolha detalhada do serviço (e opcionais como pintura) só ocorre na barbearia.
 
![AS IS](https://github.com/user-attachments/assets/d3836199-07c1-4cc5-a50e-a7e98b13b470)

## __DETALHAMENTO DAS ATIVIDADES__

__MANDAR MENSAGEM__

- Campos Chave: Conteúdo da Mensagem, Canais de Comunicação (WhatsApp, Telefone, Outro).

- Comandos Chave: Enviar (Destino: Vai até a barbearia e Consulta Agenda).


__CONSULTA AGENDA__

- Campos Chave: Data desejada, Horário desejado.

- Comandos Chave: Consultar (Destino: Disponível?).


__MARCA O HORÁRIO__

- Campos Chave: Data, Horário Agendado.

- Comandos Chave: Marcar (Destino: Escolher o Serviço).


__ESCOLHER O SERVIÇO__

- Campos Chave: Serviço Desejado (Cabelo, Barba ou Sobrancelha).

- Comandos Chave: Escolher (Destino: Cabelo, Barba ou Sobrancelha).


__CABELO__

- Campos Chave: Tipo de Corte, Tamanho Desejado.

- Comandos Chave: Continuar (Destino: Realiza o Serviço).


__BARBA__

- Campos Chave: Tipo de Barba, Uso de Toalha Quente.

- Comandos Chave: Continuar (Destino: Realiza o Serviço).


__SOBRANCELHA__

- Campos Chave: Tipo de Serviço, Método Preferido.

- Comandos Chave: Continuar (Destino: Realiza o Serviço).


__REALIZA O SERVIÇO__

- Campos Chave: Data/Hora Início, Data/Hora Fim.

- Comandos Chave: Concluir (Destino: Realiza o Pagamento).


__REALIZA O PAGAMENTO__

- Campos Chave: Valor Total (Número), Forma de Pagamento (Seleção única: Dinheiro, Cartão, PIX), Status da Transação.

- Comandos Chave: Pagar (Destino: Pagamento Confirmado).



_**TABELAS**_


**MANDA MENSAGEM**

| **Campo**       | **Tipo**         | **Restrições** | **Valor default** |
| ---             | ---              | ---            | ---               |
| Conteúdo da mensagem | Área de texto |  | "Gostaria de agendar um horário" |
| Canal de Comunicação | Seleção única | "WhatsApp, Telefone, Outro" | "WhatsApp" |
| Data/Hora da Mensagem | Data/Hora | Preencimento automático | Data/Hora atual |

| **Comandos** | **Destino** | **Tipo** |
| --- | --- | --- |
| Enviar | Vai até a Barbearia (paralelo) | default |


**CONSULTA AGENDA**

| **Campo**       | **Tipo**         | **Restrições** | **Valor default** |
| --- |  --- |   --- |  ---|
| Data desejada | Data | ---            | Data atual |
| Horário desejado | Hora |                | Hora atual |
| Barbeiro Verificar | Caixa de Texto |  | "Qualquer" |

| **Comandos**         |  **Destino**                   | **Tipo**          |
| ---                  | ---                            | ---               |
| Consultar | Disponível?  | default |


**MARCA O HORÁRIO**

| **Campo**       | **Tipo**         | **Restrições** | **Valor default** |
| ---             | ---              | ---            | ---               |
| Data do horário | Data |  | Data atual |
| Horário Agendado | Hora |  | Próximo horário disponível |

| **Comandos**         |  **Destino**                   | **Tipo**          |
| ---                  | ---                            | ---               |
| Marcar | Escolhe o serviço | default |


**ESCOLHER O SERVIÇO**

| **Campo**       | **Tipo**         | **Restrições** | **Valor default** |
| ---             | ---              | ---            | ---               |
| Serviço desejado | Seleção única | "Cabelo, Barba e Sobrancelha" | "Cabelo" |
| Preferência de Barbeiro | Caixa de texto |  | "Qualquer" |

| **Comandos**         |  **Destino**                   | **Tipo**          |
| ---                  | ---                            | ---               |
| Escolher | Cabelo, Barba ou Sobrancelha | default |


**CABELO**

| **Campo**       | **Tipo**         | **Restrições** | **Valor default** |
| ---             | ---              | ---            | ---               |
| Tipo de Corte | Caixa de texto |  | "Tradicional" |
| Tamanho Desejado | Seleção única | "Curto, Médio ou Longo" | "Curto" |

| **Comandos**         |  **Destino**                   | **Tipo**          |
| ---                  | ---                            | ---               |
| Continuar | Realiza o serviço | default |


**BARBA**

| **Campo**       | **Tipo**         | **Restrições** | **Valor default** |
| ---             | ---              | ---            | ---               |
| Tipo de Barba | Caixa de texto |  | "Aparar" |
| Uso de Toalha Quente | Seleçãu única | "Sim ou Não" | "Sim" |

| **Comandos**         |  **Destino**                   | **Tipo**          |
| ---                  | ---                            | ---               |
| Continuar | Realiza o serviço | default |


**SOBRANCELHA**

| **Campo**       | **Tipo**         | **Restrições** | **Valor default** |
| ---             | ---              | ---            | ---               |
| Tipo de Serviço | Seleção única | "Aparar ou Fazer" | "Aparar" |
| Uso de Toalha Quente | Seleçãu única | "Pinça, Certa ou Linha" | "Pinça" |

| **Comandos**         |  **Destino**                   | **Tipo**          |
| ---                  | ---                            | ---               |
| Continuar | Realiza o serviço | default |


**REALIZA SERVIÇO**

| **Campo**       | **Tipo**         | **Restrições** | **Valor default** |
| ---             | ---              | ---            | ---               |
| Data/Hora Inicio | Data/Hora | Preenchimento automático | Data/Hora atual |
| Data/Hora Fim | Data/Hora | Preenchimento automático |  |
| Barbeito Executannte | Caixa de texto |  |  |
| Observações | Área de texto |  |  |

| **Comandos**         |  **Destino**                   | **Tipo**          |
| ---                  | ---                            | ---               |
| Concluir | Realiza o Pagamento | default |


**REALIZA O PAGAMENTO**

| **Campo**       | **Tipo**         | **Restrições** | **Valor default** |
| ---             | ---              | ---            | ---               |
| Valor Total | Número | > 0 |  |
| Forma de Pagamento | Seleção única | "Dinheiro, cartão ou PIX" | "Cartão" |
| Status da Transação | Seleção única | "Pendente, Aprovado ou Recusado" | "Pendente" |

| **Comandos**         |  **Destino**                   | **Tipo**          |
| ---                  | ---                            | ---               |
| Pagar | Pagamento Confirmado | default |
| Cancelar | Fim do Processo (se pagamento recusado) | cancel |
