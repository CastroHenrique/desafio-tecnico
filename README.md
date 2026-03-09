# Desafio Técnico — API de Gestão de Imóveis e Propostas de Aluguel

API REST em Node.js/TypeScript para gestão de **usuários**, **imóveis** e **propostas de aluguel**, com fluxo de status das propostas e integração ao status do imóvel (disponível, em negociação, alugado).

---

## Índice

- [Pré-requisitos](#pré-requisitos)
- [Configuração](#configuração)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Como testar](#como-testar)
- [Decisões de design](#decisões-de-design)

---

## Pré-requisitos

- **Node.js** 18+ (recomendado 20)
- **MySQL** 8.x (ou compatível)
- **npm** ou **yarn**

---

## Configuração

### 1. Clonar e instalar dependências

```bash
git clone https://github.com/CastroHenrique/desafio-tecnico.git
cd desafio-tecnico
npm install
```

### 2. Variáveis de ambiente

Copie o arquivo de exemplo e ajuste com os dados do seu banco:

```bash
cp .env.example .env
```

**Ambiente de desenvolvimento** — use as variáveis abaixo no `.env`:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DB_HOST` | Host do MySQL | `localhost` |
| `DB_PORT` | Porta do MySQL | `3306` |
| `DB_USER` | Usuário do banco | `root` |
| `DB_PASSWORD` | Senha do banco | `sua_senha` |
| `DB_NAME` | Nome do banco | `desafio_tecnico` |
| `DB_CONNECTION_STRING` | *(opcional)* URI de conexão | `mysql://user:pass@host:3306` |
| `SERVER_OUTPUT_PORT` | Porta da API | `3304` |

- Se usar `DB_CONNECTION_STRING`, ela será usada pela aplicação; caso contrário, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` e `DB_NAME` são utilizados.
- Em **produção**, o `knexfile` usa as variáveis `DB_*`; você pode manter o mesmo padrão no `.env` de produção.

### 3. Banco de dados

Crie o banco (se não existir) e rode as migrations e seeds:

```bash
# Rodar migrations (cria tabelas)
npx knex migrate:latest

# Rodar seeds (dados iniciais: usuários e imóveis)
npx knex seed:run
```

---

## Como rodar o projeto

- **Desenvolvimento** (com hot-reload):

```bash
npm run dev
```

- **Produção** (build e start):

```bash
npm run build
npm start
```

A API sobe na porta definida em `SERVER_OUTPUT_PORT` (padrão: 80; ex.: 3304 em dev).

**Endpoints principais:**

- `POST/GET/PUT/DELETE /users` — usuários
- `POST/GET/PUT/DELETE /properties` — imóveis
- `POST/GET/PUT/DELETE /rentalProposals` — propostas de aluguel
- Histórico de status: consulte a rota de listagem/status das propostas (conforme implementado em `rentalProposals`)

---

## Como testar

Os testes usam **Jest** e **Supertest**. O **global setup**:

1. Cria um banco de teste (nome do banco + `_test`)
2. Roda migrations e seeds nesse banco

**Requisito:** Um MySQL acessível com as mesmas variáveis de ambiente (`DB_*` ou `DB_CONNECTION_STRING`). O banco de teste será `{DB_NAME}_test`.

```bash
npm test
```

Para rodar sem watch (uma vez):

```bash
npx jest --runOnce --no-cache --detectOpenHandles
```


## Decisões de design

### Tecnologias escolhidas

| Tecnologia | Motivo |
|------------|--------|
| **Node.js + TypeScript** | Tipagem estática, boa manutenção e IDE support; ecossistema rico para APIs. |
| **Express** | Simples, estável e amplamente usado para APIs REST. |
| **Knex.js** | Query builder com migrations, seeds e suporte a transações, sem impor um ORM pesado. |
| **MySQL (mysql2)** | Banco relacional com ACID, locks e FKs; InnoDB para transações e integridade. |
| **Jest + Supertest** | Testes unitários e de integração via HTTP contra a API. |

### Arquitetura do código

- **Use cases**: regras de negócio (criar proposta, atualizar status, etc.).
- **Controllers**: recebem a requisição, chamam o use case e devolvem a resposta HTTP.
- **Repositories**: abstraem o acesso a dados (MySQL via Knex); interfaces permitem trocar implementação (ex.: testes).
- **Entities**: modelos de domínio (usuário, imóvel, proposta, histórico de status).

Essa separação facilita testes, evita acoplamento ao banco e deixa o fluxo de negócio claro.

### Integridade de dados

1. **Transações (Knex)**  
   Operações que envolvem mais de uma tabela (ex.: criar proposta + atualizar status do imóvel, ou atualizar proposta + histórico + imóvel) são executadas dentro de `knex.transaction()`. Em caso de erro, é feito `rollback`; assim, não ficam dados parciais.

2. **Constraints no banco**  
   - Foreign keys em `rental_proposals` (propertyId, userId) e em `proposal_status_histories` (rentalProposalId), com `ON DELETE CASCADE` onde faz sentido.  
   - Unique em endereço completo em `properties` para evitar duplicidade.  
   - Tabelas com engine **InnoDB** para suporte a transações e locks.

3. **Máquina de estados nas propostas**  
   As mudanças de status das propostas seguem um fluxo controlado (`VALID_TRANSITIONS` em `RentalProposals`). Só transições permitidas são aceitas; isso evita estados inválidos (ex.: de CANCELADA para ATIVO).

4. **Histórico de status**  
   A tabela `proposal_status_histories` registra cada mudança (oldStatus → newStatus), garantindo rastreabilidade e auditoria sem alterar o dado atual da proposta.

5. **Soft delete**  
   Uso de `deletedAt` e `deletedBy` em usuários, imóveis e propostas para não perder histórico e manter integridade referencial.

### Concorrência

1. **Transações como unidade de trabalho**  
   Cada criação ou atualização crítica (proposta, status do imóvel, histórico) roda dentro de uma única transação. O isolamento padrão do MySQL (REPEATABLE READ no InnoDB) reduz leituras sujas e inconsistências entre leitura e escrita no mesmo request.

2. **Regras no use case**  
   - Ao criar proposta: verificação na mesma transação se já existe proposta para aquele imóvel e usuário e se o imóvel está DISPONIVEL; em seguida atualização do imóvel para EM_NEGOCIACAO e inserção da proposta.  
   - Ao atualizar status: validação da transição permitida, atualização da proposta, do imóvel (se for o caso) e inserção no histórico na mesma transação.  
   Assim, duas requisições concorrentes que tentem criar a mesma proposta ou levar o mesmo imóvel a estados inconsistentes tendem a ser serializadas (uma falha por regra de negócio ou por constraint).

3. **InnoDB**  
   Row-level locking e detecção de deadlocks ajudam em cenários de alta concorrência; em cenários mais críticos, pode-se evoluir para `SELECT ... FOR UPDATE` nas linhas do imóvel/proposta antes de alterar.

Resumindo: **transações + regras de negócio + constraints no banco + máquina de estados** garantem integridade e um comportamento previsível sob concorrência moderada, com espaço para refinamentos (locks explícitos ou filas) se o volume crescer.
