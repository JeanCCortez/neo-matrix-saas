# **POLÍTICA DE PRIVACIDADE DO SMITH PROGRAM**

**Última Atualização**: 22 de julho de 2026
**Vigência**: 22 de julho de 2026

A **Neo Matrix Quantum Solutions Ltda.** ("Empresa"), CNPJ [NÚMERO], com sede em [ENDEREÇO], é a **controladora** dos dados pessoais coletados pelo **Smith Program** ("Serviço"). Esta Política de Privacidade descreve como coletamos, usamos, compartilhamos e protegemos seus dados pessoais.

---

## **1. Dados Coletados**
Coletamos os seguintes dados pessoais:

### **1.1. Dados de Cadastro**
- E-mail.
- Senha (criptografada com bcrypt).
- Data de criação da conta.
- Endereço IP (para segurança).

### **1.2. Dados de Uso**
- Histórico de execuções (timestamps, backends IBM Quantum utilizados, job IDs, fidelidade final).
- Tokens consumidos.
- Logs de acesso (data, hora, IP).

### **1.3. Dados de Pesquisa**
- Respostas ao survey de intenção de assinatura:
  - Uso pretendido (acadêmico, empresa, pessoal, outro).
  - Quantidade de circuitos quânticos executados por mês.
  - Disposição para pagar pelo Serviço.

### **1.4. Dados de Pagamento**
- Informações fornecidas ao [Stripe/MercadoPago] (não armazenadas pela Empresa).

### **1.5. Dados Não Coletados**
- **Tokens ou credenciais da IBM Quantum** (utilizados apenas em memória e descartados após a execução).
- **Circuitos quânticos** enviados pelo Usuário (apenas os resultados agregados são armazenados).
- **Dados sensíveis** (origem racial, religião, saúde, etc.), exceto quando explicitamente fornecidos pelo Usuário em campos opcionais.

---

## **2. Base Legal para Tratamento (LGPD, Art. 7)**

| **Finalidade**               | **Base Legal**               | **Dados Envolvidos**                     |
|------------------------------|-------------------------------|------------------------------------------|
| Cadastro e autenticação      | Execução de contrato (Art. 7, V) | E-mail, senha, tokens de acesso          |
| Execução do Serviço          | Execução de contrato (Art. 7, V) | Histórico de execuções, tokens consumidos |
| Melhoria do Serviço          | Legítimo interesse (Art. 7, IX) | Dados de uso (anonimizados)              |
| Pesquisa e marketing         | Consentimento (Art. 7, I)      | Respostas ao survey                       |
| Comunicações transacionais   | Execução de contrato (Art. 7, V) | E-mail                                    |
| Segurança e prevenção a fraudes | Legítimo interesse (Art. 7, IX) | Endereço IP, logs de acesso               |

---

## **3. Finalidades do Tratamento**

### **3.1. Fornecer o Serviço**
- Executar circuitos quânticos e mitigar erros.
- Gerenciar o saldo de tokens.
- Autenticar e autorizar o acesso.

### **3.2. Comunicações**
- Enviar e-mails transacionais (ex.: recuperação de senha, confirmação de cadastro).
- Notificar sobre violações de dados (LGPD, Art. 48).

### **3.3. Melhoria do Serviço**
- Analisar padrões de uso para desenvolver novas funcionalidades.
- Corrigir bugs e otimizar desempenho.

### **3.4. Pesquisa e Marketing**
- Usar métricas agregadas e anonimizadas para divulgação.
- Enviar pesquisas de satisfação (com consentimento).

---

## **4. Compartilhamento de Dados**

### **4.1. Terceiros**
Compartilhamos dados com:
- **IBM Quantum**: Envio de credenciais temporárias (em memória) para execução de circuitos.
- **Parceiros de Pagamento**: [Stripe/MercadoPago] para processamento de transações.
- **Provedores de Infraestrutura**: AWS/IBM Cloud para hospedagem (dados anonimizados).

### **4.2. Autoridades Competentes**
- Quando exigido por **lei ou ordem judicial** (ex.: investigações criminais).
- Para cumprir obrigações legais (ex.: fiscalização da ANPD).

### **4.3. Transferência Internacional**
- Os dados podem ser transferidos para servidores da **IBM Quantum**, localizados nos **Estados Unidos** ou outros países.
- Essa transferência é regida por **Cláusulas Contratuais Padrão (SCC)** aprovadas pela ANPD e pela Comissão Europeia, garantindo o mesmo nível de proteção exigido pela LGPD e GDPR.

---

## **5. Retenção de Dados**

| **Categoria de Dados**       | **Prazo de Retenção**               | **Base Legal**               |
|------------------------------|-------------------------------------|-------------------------------|
| Dados de cadastro            | 5 anos após o último acesso         | Obrigação legal (LGPD, Art. 15) |
| Logs de uso                   | 6 meses                             | Legítimo interesse (LGPD, Art. 7, IX) |
| Dados de pagamento            | 5 anos                              | Obrigação fiscal (Lei 5.172/1966) |
| Respostas ao survey           | 2 anos                              | Consentimento (LGPD, Art. 8)    |
| Dados de violação de segurança | 5 anos                              | Obrigação legal (LGPD, Art. 48) |

---

## **6. Direitos do Titular (LGPD, Art. 18)**
Você tem direito a:

### **6.1. Acessar seus dados pessoais**
- Solicitar uma cópia dos dados que coletamos sobre você.

### **6.2. Corrigir dados incorretos ou desatualizados**
- Atualizar suas informações de cadastro.

### **6.3. Excluir seus dados**
- Solicitar a exclusão de seus dados pessoais, exceto quando houver obrigação legal de retenção.

### **6.4. Portar seus dados**
- Receber seus dados em formato estruturado para transferência a outro serviço.

### **6.5. Revogar o consentimento**
- Revogar o consentimento para tratamento de dados a qualquer momento.

### **6.6. Opor-se ao tratamento**
- Opor-se ao tratamento de dados com base em legítimo interesse.

### **6.7. Não ser discriminado**
- Não sofrer discriminação pelo exercício de seus direitos.

**Como exercer seus direitos**:
Envie um e-mail para **[privacidade@smithprogram.com]** com o assunto "Exercício de Direitos LGPD". Responderemos em até **15 dias** (LGPD, Art. 19).

---

## **7. Segurança dos Dados**
Implementamos medidas técnicas e organizacionais para proteger seus dados:

### **7.1. Medidas Técnicas**
- **Criptografia**: Senhas (bcrypt), dados em trânsito (TLS 1.2+).
- **Controles de Acesso**: Acesso restrito a funcionários autorizados.
- **Monitoramento**: Registramos logs de acesso para auditoria.
- **Backups**: Backups criptografados e armazenados em locais seguros.

### **7.2. Medidas Organizacionais**
- **Treinamento**: Funcionários são treinados em proteção de dados.
- **Políticas Internas**: Procedimentos para tratamento de dados e resposta a incidentes.
- **Auditorias**: Auditorias regulares de segurança e conformidade.

---

## **8. Cookies e Tecnologias Semelhantes**
Utilizamos cookies para:
- **Melhorar a experiência do Usuário** (ex.: animações no dashboard).
- **Analisar o uso do Serviço** (dados anonimizados).

**Tipos de Cookies**:
| **Tipo**          | **Finalidade**                     | **Duração**       |
|-------------------|------------------------------------|-------------------|
| Essenciais        | Funcionamento básico do Serviço    | Sessão            |
| Analíticos        | Melhoria do Serviço                | 1 ano             |
| Preferências      | Personalização da experiência      | 1 ano             |

**Gerenciamento de Cookies**:
Você pode **recusar cookies não essenciais** através das configurações do seu navegador. No entanto, isso pode afetar a funcionalidade do Serviço.

---

## **9. Alterações na Política**
9.1. Esta Política pode ser alterada a qualquer momento, com **notificação prévia** via e-mail ou aviso no dashboard.
9.2. O uso contínuo do Serviço após a notificação constitui **aceite das alterações**.

---

## **10. Contato**
Para dúvidas ou solicitações relacionadas a esta Política, entre em contato pelo e-mail:
**[privacidade@smithprogram.com]**.

---

**Neo Matrix Quantum Solutions Ltda.**
[Endereço]
CNPJ: [NÚMERO]