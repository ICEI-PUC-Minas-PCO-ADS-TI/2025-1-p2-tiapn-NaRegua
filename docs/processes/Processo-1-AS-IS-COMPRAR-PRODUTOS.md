### 3.3.2 Processo 2 – COMPRAR PRODUTOS
 
_Este processo descreve como um cliente adquire produtos na loja ou barbearia. O cliente clica na aplicação para entrar na aba da loja e, em seguida, seleciona uma categoria para visualizar os produtos no site. Um ponto de decisão é alcançado: "Decide se vai comprar". Se "Não" for comprar, o processo se encerra. Se "Sim", o cliente escolhe os produtos e informa os produtos. Paralelamente, o barbeiro recebe o pedido e o prepara. Após a preparação, o cliente vai para a barbearia para retirada. Lá, o cliente realiza o pagamento e retira o pedido. Finalmente, o barbeiro encerra o atendimento._

![AS IS](https://github.com/user-attachments/assets/f9e58658-4773-481b-84e8-003039748046)


#### Detalhamento das atividades

__CLICAR NA APLICAÇÃO__

- **Tipo de Dispositivo**: Tipo: Seleção única. Restrições: "Smartphone", "Tablet", "Computador". Valor default: "Smartphone".

Horário do Clique: Tipo: Data e Hora. Restrições: Preenchimento automático. Valor default: Data/Hora atual.

- **Comandos**: Abrir: Destino: Entra na aba da Loja. Tipo: default.

__ENTRA NA ABA DA LOJA__

- **Nome da Aba Acessada: Tipo**: Caixa de texto. Restrições: Nenhuma. Valor default: "Loja de Produtos".

- **Tempo de Carregamento**: Tipo: Número. Restrições: Em segundos, > 0. Valor default: 3.

- **Comandos**: Acessar: Destino: Seleciona a Categoria. Tipo: default.

__SELECIONA A CATEGORIA__

- **Categoria Escolhida**: Tipo: Caixa de texto. Restrições: Ex: "Cabelo", "Barba", "Acessórios", "Ferramentas". Valor default: "Cabelo".

- **Quantidade de Categorias**: Tipo: Número. Restrições: Número inteiro, > 0. Valor default: 5.

- **Comandos**: Selecionar: Destino: Visualiza o produto no site. Tipo: default.


__ESCOLHE OS PRODUTOS__

- **Campos**: Produtos Selecionados: Tipo: Tabela. Restrições: Colunas: "Nome do Produto", "Quantidade". Valor default:.

- **Valor Total Parcial (R$)**: Tipo: Número. Restrições: Soma dos produtos selecionados, > 0. Valor default: 0.

- **Comandos**: Selecionar: Destino: Informa os Produtos. Tipo: default.

- **Cancelar**: Destino: Fim do Processo. Tipo: cancel.

__INFORMAR OS PRODUTOS__

- **Lista de Produtos**: Tipo: Área de texto. Restrições: Descrição dos itens e quantidades. Valor default: N/A.

- **Nome do Cliente**: Tipo: Caixa de texto. Restrições: Obrigatório, min. 3 caracteres. Valor default: N/A.

- **Contato do Cliente**: Tipo: Caixa de texto. Restrições: Telefone ou E-mail, formato válido. Valor default: N/A.

- **Data/Hora da Informação**: Tipo: Data e Hora. Restrições: Preenchimento automático. Valor default: Data/Hora atual.

- **Comandos**: Enviar Informações: Destino: Recebe o pedido. Tipo: default.

__RECEBE O PEDIDO__ 

- **ID do Pedido (manual)**: Tipo: Caixa de texto. Restrições: Pode ser um código de referência gerado manualmente ou o nome do cliente. Valor default.

- **Produtos Recebidos**: Tipo: Área de texto. Restrições: Lista de produtos e quantidades informadas pelo cliente. Valor default: N/A.

- **Data/Hora do Recebimento**: Tipo: Data e Hora. Restrições: Preenchimento automático. Valor default: Data/Hora atual.

- **Canal de Recebimento**: Tipo: Seleção única. Restrições: "Mensagem", "Pessoalmente", "Telefone". Valor default: "Mensagem".

- **Comandos**: Confirmar Recebimento: Destino: Prepara o pedido. Tipo: default.

- **Dúvida**: Destino: Informa os Produtos. Tipo: N/A.

__PREPARA O PRODUTO__

- **Status da Preparação**: Tipo: Seleção única. Restrições: "Em andamento", "Pronto para retirada". Valor default: "Em andamento".

- **Itens Separados**: Tipo: Tabela. Restrições: Colunas: "Produto", "Qtde Verificada", "Localização Estoque". Valor default: N/A.

- **Tempo de Preparação**: Tipo: Número. Restrições: Em minutos, > 0. Valor default: 5.

- **Responsável pela Preparação**: Tipo: Caixa de texto. Restrições: Nome do barbeiro/atendente. Valor default: N/A.

- **Comandos**: Finalizar Preparação: Destino: Linha pontilhada. Tipo: default.

- **Problema no Estoque**: Destino: Recebe o pedido. Tipo: N/A.


__REALIZA O PAGAMENTO__

- **Valor Total a Pagar (R$)**: Tipo: Número. Restrições: Valor monetário > 0. Valor default: N/A.

- **Forma de Pagamento**: Tipo: Seleção única. Restrições: "Dinheiro", "Cartão de Crédito", "Cartão de Débito", "PIX". Valor default: "Cartão de Crédito".

- **Comprovante Recebido**: Tipo: Seleção única. Restrições: "Sim", "Não". Valor default: "Sim".

- **Data/Hora do Pagamento**: Tipo: Data e Hora. Restrições: Preenchimento automático. Valor default: Data/Hora atual.

- **Comandos**: Pagar: Destino: Retira o Pedido. Tipo: default.

- **Não Pagar**: Destino: Fim do Processo. Tipo: cancel.

__**TABELAS**__

**Clicar na Aplicação**

| **Campo**       | **Tipo**         | **Restrições** | **Valor default** |
| ---             | ---              | ---            | ---               |
| Tipo de Dispositivo | Seleção única  | "Smartphone", "Tablet", "Computador" | "Smartphone" |
| Horário do Clique | Data e Hora   | Preenchimento automático | Data/Hora atual |

| **Comandos**         |  **Destino**                   | **Tipo** |
| ---                  | ---                            | ---               |
| Abrir | Entra na aba da Loja  | default |



**Entra na loja**

| **Campo**       | **Tipo**         | **Restrições** | **Valor default** |
| ---             | ---              | ---            | ---               |
| Nome da Aba Acessada | Caixa de texto  |  | "Produtos" |
| Tempo de Carregamento | Número | Em segundos, > 0 | 3 |

| **Comandos**         |  **Destino**                   | **Tipo**          |
| ---                  | ---                            | ---               |
| Acessar | Seleciona a Categoria  | default |


**Seleiona a categoria**

| **Campo**       | **Tipo**         | **Restrições** | **Valor default** |
| ---             | ---              | ---            | ---               |
| Categoria Escolhida  | Caixa de texto | "Cabelo", "Barba", "Acessórios", "Ferramentas" | "Cabelo"|
| Quantidade de Categorias | Número | Número inteiro > 0 | 5 |

| **Comandos**         |  **Destino**                   | **Tipo**          |
| ---                  | ---                            | ---               |
| Selecionar | Visualiza o produto no site  | default |


**Escolhe os produtos**

| **Campo**       | **Tipo**         | **Restrições** | **Valor default** |
| ---             | ---              | ---            | ---               |
| Produtos Selecionados | Tabela  | Colunas: "Nome do Produto", "Quantidade", "Preço Unitário (R$)" |  |
| Valor Total Parcial (R$) | Número | Soma dos produtos selecionados > 0 | 0 |

| **Comandos**         |  **Destino**                   | **Tipo**          |
| ---                  | ---                            | ---               |
| Selecionar | Informa os Produtos  | default |


**Informar os Produtos**

| **Campo**       | **Tipo**         | **Restrições** | **Valor default** |
| ---             | ---              | ---            | ---               |
| Lista de Produtos | Área de texto  | Descrição dos itens e quantidades |  |
| Nome do Cliente | Caixa de texto |  |  |
| Contato do Cliente | Caixa de texto | Telefone ou E-mail |  |

| **Comandos**         |  **Destino**                   | **Tipo**          |
| ---                  | ---                            | ---               |
| Enviar Informações | Recebe o pedido (paralelo)  | default |


**Prepara o produto**

| **Campo**       | **Tipo**         | **Restrições** | **Valor default** |
| ---             | ---              | ---            | ---               |
| Status da Preparação | Seleção única  | "Em andamento", "Pronto para retirada" | "Em andamento" |
| Itens Separados | Tabela | Colunas: "Produto", "Qtde Verificada" |  |
| Tempo de Preparação | Número | Em minutos | 5 |

| **Comandos**         |  **Destino**                   | **Tipo**          |
| ---                  | ---                            | ---               |
| Finalizar Preparação | Linha pontilhada para "Vai para a barbearia" | default |


**Realiza o pagamento**

| **Campo**       | **Tipo**         | **Restrições** | **Valor default** |
| ---             | ---              | ---            | ---               |
| Valor Total a Pagar | Número  | > 0  |  |
| Forma de Pagamento | Seleção única | "Dinheiro", "Cartão de Crédito", "Cartão de Débito", "PIX" | "Cartão de Crédito" |
| Comprovante Recebido | Seleção única | "Sim", "Não" | "Sim" |

| **Comandos**         |  **Destino**                   | **Tipo**          |
| ---                  | ---                            | ---               |
| Pagar | Retira o Pedido | default |
| Cancelar | Encerrar o Atendimento (se não pagar) | default |


**Retira o pedido**

| **Campo**       | **Tipo**         | **Restrições** | **Valor default** |
| ---             | ---              | ---            | ---               |
| Confirmação da Retirada | Seleção única  | "Sim", "Não"  | "Sim" |
| Itens Conferidos | Seleção única | "Sim", "Não" | "Sim" |

| **Comandos**         |  **Destino**                   | **Tipo**          |
| ---                  | ---                            | ---               |
| Retirar | Encerrar o Atendimento (Barbeiro) | default |