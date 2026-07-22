# NEO MATRIX SaaS

## Estrutura
```
server/
  app.py              - API FastAPI (auth, /v1/run, admin, saldo)
  models.py           - Banco de dados (usuários, uso, compras)
  spam_cache.py       - Cache de calibração SPAM em memória (TTL 30 min)
  neo_pipeline.py     - Núcleo do NEO MATRIX (segredo comercial)
  requirements.txt

client_example/
  neo_client.py       - CLI que o cliente roda no terminal dele

docs/
  terms_rascunho_tecnico.md   - Pra levar ao advogado
```

## Rodar localmente
```bash
pip install -r server/requirements.txt
cd server
uvicorn app:app --host 0.0.0.0 --port 8000
```

## Fluxo do usuário
1. `POST /v1/auth/register` (email+senha) → recebe API key + 10 tokens grátis
2. Configura no terminal dele:
   ```
   export NEO_API_KEY=...   # a que ele recebeu
   export IBM_TOKEN=...     # token da IBM dele
   export IBM_CRN=...       # CRN da IBM dele
   ```
3. Roda `python neo_client.py circuito.qasm3 --backend ibm_fez`
4. Servidor:
   - Autentica via API key
   - Verifica saldo (>= 2 tokens)
   - Reusa SPAM se em cache; senão calibra e cacheia (30 min)
   - Roda pipeline
   - Cobra 2 tokens, registra histórico com job_id IBM
   - Devolve resultado

## Decisões trancadas na fase inicial
- **Modo efêmero**: token IBM do cliente nunca salvo (nem em cache).
- **Cache SPAM 30 min por backend** compartilhado entre usuários (t00/t11 não é dado privado).
- **1 disparo = 2 tokens** (cobre calibração média).
- **10 tokens grátis no cadastro** (~5 disparos de teste).
- **Sem cofre de credenciais** — vira decisão de negócio quando houver receita, usando IBM Key Protect.

## O que já está pronto pra ir pro ar
- Cadastro, login, API key
- Endpoint `/v1/run` com autenticação + cobrança + cache SPAM + registro de uso
- Endpoints do dashboard cliente (`/v1/me`, `/v1/me/usage`, `/v1/me/subscription-intent`)
- Endpoints admin (`/v1/admin/overview`, `/v1/admin/users`, `/v1/admin/usage`)
- CLI cliente que consome tudo isso
- Rascunho técnico de termos pra advogado

## O que falta e onde entra profissional

| Tarefa | Quem faz | Por quê |
|---|---|---|
| Frontend do dashboard (mobile/tablet) | Dev/designer frontend | Não é código de backend |
| Integração real com gateway de pagamento (Stripe/MP) | Dev + compliance PCI-DSS | Envolve contrato com gateway e KYC |
| Texto jurídico dos termos | Advogado | Vai além de esqueleto técnico |
| Migrar hash de senha para bcrypt/argon2 | Antes de produção | SHA256 é placeholder auditável |
| CORS restrito ao domínio real | Antes de produção | Hoje está `*` p/ facilitar teste |
| Configurar HTTPS | IBM Cloud (nginx/gateway) | Token IBM trafega no body |
| Deploy contêinerizado (Docker) | Devops | Não fiz aqui pra manter minimalista |
| Backup do banco | Devops | SQLite → PostgreSQL na hora de escalar |
| Rate limit por IP e por conta | Antes de abrir grátis | Evitar abuso do saldo grátis |
| Monitoramento (logs, alertas) | Devops | IBM Cloud Log Analysis já dá base |

## Segurança — decisões técnicas que já estão no código
- Token IBM e CRN só existem em memória durante a requisição.
- Nada de token/CRN em logs (só metadados: user_id, backend, shots).
- Senhas em hash com salt (trocar por bcrypt antes de prod).
- API key nossa autentica o cliente na nossa API (X-API-Key header).
- Circuitos enviados **não** são persistidos (nem no cache, nem no banco).
- Job IDs da IBM ficam registrados só para auditoria (cliente vê os dele em `/v1/me/usage`).

## Próximo passo lógico
1. Testar tudo local com IBM Quantum real (você fazendo o papel de primeiro usuário).
2. Deploy num container no IBM Cloud (Code Engine é a opção mais barata).
3. Registrar domínio, configurar HTTPS.
4. Levar rascunho de termos pro advogado + revisão de LGPD.
5. Convidar os primeiros 5-10 alvos (começando pelo CBPF do Rio) pra testar.
