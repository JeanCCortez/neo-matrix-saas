# Rascunho técnico dos Termos de Uso e Política de Privacidade

**NÃO É TEXTO JURÍDICO PRONTO.** Este documento é um esqueleto do que precisa constar
nos termos, com foco no que a arquitetura técnica do NEO MATRIX faz e não faz.
O texto final precisa ser revisado por advogado familiarizado com SaaS/tecnologia,
LGPD (Brasil) e — se atender clientes americanos — CCPA/GDPR conforme aplicável.

---

## Pontos que os termos devem cobrir

### 1. Natureza do serviço (fase inicial)
- NEO MATRIX é um serviço de mitigação de erro para computação quântica.
- Serviço está em fase **beta / degustação**: sem SLA de disponibilidade,
  sem garantia de precisão do resultado, sujeito a mudanças sem aviso prévio.

### 2. Credenciais IBM do cliente (ponto crítico de confiança)
- Deixar EXPLÍCITO que:
  - O token IBM e o CRN do cliente **são enviados a cada chamada**.
  - **NÃO são armazenados** em disco, banco de dados ou log — vivem apenas
    na memória do processo durante a execução daquela chamada.
  - São **descartados** ao final da execução (referências removidas).
  - Cliente pode auditar isso via endpoints `/v1/me/usage` e `/v1/admin/*`
    (nenhum campo contém token ou CRN).

### 3. Uso da API IBM Quantum pelo cliente
- O consumo de QPU/tempo de execução é da **conta IBM do cliente**, não da nossa.
- Cliente é responsável pelos custos incorridos na conta IBM dele.
- Cliente é responsável pela validade e permissões de seu token/CRN.

### 4. Calibração compartilhada (SPAM cache)
- Cada nova execução em um backend específico pode incluir 1 disparo de
  calibração adicional na conta IBM do cliente que iniciou a chamada.
- Esse dado de calibração (t00/t11) é reutilizado em memória por até
  30 minutos entre requisições no mesmo backend, para reduzir custo.
- O dado de calibração **não é privado** (é propriedade estatística do
  backend, não do cliente) e pode ser reutilizado entre clientes diferentes.

### 5. Cobrança em tokens NEO MATRIX
- Cada execução consome 2 tokens do saldo do cliente.
- Tokens são adquiridos separadamente do consumo de QPU.
- Sem reembolso automático em caso de falha do backend IBM (o serviço
  cobra pelo processamento tentado; falha do hardware externo é fora
  do escopo). Reembolso caso a caso, sob análise.

### 6. Dados coletados sobre o cliente (LGPD/CCPA)
- Email, senha (hash), histórico de uso (timestamps, backend, job IDs,
  fidelidade final), respostas de pesquisa de intenção de assinatura.
- **NÃO coletamos**: token IBM, CRN, circuitos enviados, resultados brutos
  (a menos que cliente ative opção específica no futuro).
- Direitos do titular (LGPD art. 18): acesso, correção, portabilidade,
  eliminação — canal e prazo a definir.

### 7. Segredo comercial
- Cliente concorda em não fazer engenharia reversa do serviço.
- Detalhes técnicos do pipeline não são divulgados.
- Cliente recebe apenas: fidelidade final, job ID IBM (auditável), tempo.

### 8. Sem garantias e limitação de responsabilidade
- Serviço fornecido "como está" (AS IS).
- Sem garantia de melhoria de fidelidade em qualquer caso específico.
- Sem responsabilidade por perdas indiretas ou uso comercial dos resultados.
- Cliente deve validar independentemente os resultados antes de uso crítico.

### 9. Propriedade dos resultados
- Cliente é dono do resultado gerado.
- Reservamos direito de usar métricas agregadas anonimizadas para
  divulgação (ex: "fidelidade média nossa em backend X é Y%").

### 10. Suspensão / cancelamento
- Podemos suspender conta em caso de abuso, uso indevido, ou tentativa
  de comprometer o serviço.
- Cliente pode encerrar conta a qualquer momento (dados removidos em N dias).

### 11. Alterações nos termos
- Notificação por email + aviso no dashboard antes de mudanças materiais.

### 12. Foro / legislação
- A definir com advogado (provavelmente Brasil no lançamento,
  ajustar se abrir operação nos EUA).

---

## Para o advogado, o mais importante

Estes três pontos são os que **mais protegem** o negócio na fase inicial e onde
o advogado deve dar atenção especial:

1. **Cláusula clara de "sem armazenamento de credenciais IBM"** — é
   verificável tecnicamente e vira parte do pitch de venda.
2. **Renúncia de garantia sobre resultado quântico** — a computação quântica
   ainda é experimental por natureza; nunca prometemos precisão específica.
3. **Segredo comercial protegido** — cliente aceita não tentar extrair
   ou publicar detalhes do algoritmo.

## O que NÃO cobrimos no rascunho e precisa ser adicionado por profissional

- Cláusulas específicas de LGPD (base legal, encarregado de dados, etc.)
- Se atender EUA: CCPA (California) e outras leis estaduais aplicáveis.
- Se atender UE: GDPR (base legal, DPO se necessário).
- Termos de pagamento específicos por gateway usado (Stripe, MP, etc.).
- Política de cookies do site.
