# TERMOS DE USO DO SMITH PROGRAM

**NEO MATRIX QUANTUM SOLUTIONS**

**Versão 1.0 — Data de vigência: 22 de julho de 2026**

---

## AVISO DE FASE BETA

**ESTE SERVIÇO ENCONTRA-SE EM FASE BETA GRATUITA.** Nesta fase:
- O Serviço é fornecido **gratuitamente**, sem cobrança aos usuários;
- **Não há processamento de pagamentos** — a funcionalidade de compra de tokens está desativada;
- O Serviço pode ser **descontinuado, alterado ou suspenso a qualquer momento**, sem aviso prévio;
- Não há garantias de disponibilidade, SLA ou suporte;
- **Quando houver cobrança futura**, novos Termos de Uso serão apresentados e o usuário precisará aceitar novamente para continuar utilizando o Serviço.

---

## 1. ACEITAÇÃO DOS TERMOS

1.1. Estes Termos de Uso ("Termos") constituem um contrato vinculante entre você ("Usuário", "Cliente" ou "Titular") e **Neo Matrix Quantum Solutions**, nome comercial informal utilizado por pessoa física para operação deste serviço em fase de desenvolvimento ("NEO MATRIX", "nós" ou "Operador").

1.2. O Serviço é operado por pessoa física sem registro de CNPJ nesta fase beta. Ao constituirmos pessoa jurídica futuramente, novos Termos de Uso serão apresentados.

1.3. Ao criar uma conta, acessar ou utilizar o serviço Smith Program ("Serviço" ou "Plataforma"), você declara ter lido, compreendido e concordado integralmente com estes Termos e com nossa Política de Privacidade.

1.4. **Se você não concordar com qualquer disposição destes Termos, não utilize o Serviço.**

1.5. Caso você esteja aceitando estes Termos em nome de uma empresa ou outra entidade legal, você declara ter poderes para vincular tal entidade a estes Termos.

---

## 2. DEFINIÇÕES

2.1. Para fins destes Termos, considera-se:

- **API**: Interface de Programação de Aplicações do Smith Program.
- **Backend IBM Quantum**: Processadores quânticos disponibilizados pela IBM Corporation.
- **Circuito Quântico**: Código QASM3 ou equivalente submetido pelo Usuário para execução.
- **CRN**: Cloud Resource Name, identificador de recurso na IBM Cloud.
- **Credenciais IBM**: Token de API e CRN fornecidos pelo Usuário para acesso à sua conta IBM Quantum.
- **Fidelidade**: Métrica de qualidade do resultado quântico após mitigação de erros.
- **Job**: Unidade de execução de circuito quântico no Serviço.
- **Pipeline de Mitigação**: Conjunto proprietário de técnicas de correção de erros quânticos.
- **SPAM**: State Preparation and Measurement, técnica de calibração utilizada no Pipeline.
- **Tokens NEO MATRIX**: Unidade de crédito para utilização do Serviço.

---

## 3. DESCRIÇÃO DO SERVIÇO

3.1. O Smith Program é um serviço de Software como Serviço (SaaS) que oferece mitigação de erros para computação quântica, executando circuitos quânticos nos backends IBM Quantum com técnicas proprietárias de correção de erros.

3.2. **FASE BETA GRATUITA**: O Serviço encontra-se em fase de desenvolvimento (beta). Nesta fase:
   - (a) O acesso é **totalmente gratuito**;
   - (b) **Não há cobrança** por utilização de tokens ou qualquer outro recurso;
   - (c) Não há garantia de disponibilidade ou SLA;
   - (d) Funcionalidades podem ser alteradas, adicionadas ou removidas **sem aviso prévio**;
   - (e) O Serviço pode ser **descontinuado a qualquer momento** sem aviso prévio;
   - (f) Resultados podem variar conforme condições do hardware quântico.

3.3. **TRANSIÇÃO PARA VERSÃO COMERCIAL**: Quando o Serviço sair da fase beta e passar a ter cobrança:
   - (a) Novos Termos de Uso serão publicados;
   - (b) Todos os usuários serão notificados com antecedência mínima de 30 (trinta) dias;
   - (c) O usuário **precisará aceitar os novos Termos** para continuar utilizando o Serviço;
   - (d) Tokens acumulados na fase beta poderão ser convertidos ou expirar, conforme definido nos novos Termos.

---

## 4. CADASTRO E CONTA DO USUÁRIO

4.1. Para utilizar o Serviço, você deve criar uma conta fornecendo:
   - Endereço de e-mail válido;
   - Senha segura (mínimo 8 caracteres).

4.2. Você é responsável por:
   - (a) Manter a confidencialidade de suas credenciais de acesso;
   - (b) Todas as atividades realizadas em sua conta;
   - (c) Notificar imediatamente a NEO MATRIX sobre qualquer uso não autorizado.

4.3. É vedado:
   - (a) Criar contas falsas ou utilizar identidade de terceiros;
   - (b) Compartilhar credenciais de acesso;
   - (c) Transferir a conta sem autorização prévia por escrito.

4.4. A NEO MATRIX reserva-se o direito de recusar cadastro ou suspender contas a seu exclusivo critério, especialmente em casos de violação destes Termos.

---

## 5. CREDENCIAIS IBM QUANTUM

5.1. **DECLARAÇÃO DE NÃO ARMAZENAMENTO**: A NEO MATRIX declara expressamente que:
   - (a) O Token de API IBM e o CRN do Usuário são transmitidos exclusivamente durante a requisição;
   - (b) **NÃO são armazenados** em disco, banco de dados, logs ou qualquer meio persistente;
   - (c) Permanecem apenas na memória volátil do servidor durante a execução do Job;
   - (d) São descartados imediatamente após a conclusão ou falha da execução.

5.2. O Usuário pode verificar esta prática através dos endpoints de auditoria `/v1/me/usage` e dados de acesso disponíveis no Serviço, onde nenhum campo contém tokens ou CRNs.

5.3. O Usuário é exclusivamente responsável por:
   - (a) A validade, segurança e permissões de suas Credenciais IBM;
   - (b) Os custos de QPU e tempo de execução incorridos em sua conta IBM Quantum;
   - (c) O cumprimento dos termos de uso da IBM Corporation.

5.4. A NEO MATRIX não assume responsabilidade por:
   - (a) Credenciais inválidas, expiradas ou com permissões insuficientes;
   - (b) Custos incorridos na conta IBM do Usuário;
   - (c) Falhas, indisponibilidade ou erros dos backends IBM Quantum.

---

## 6. SISTEMA DE TOKENS (FASE BETA)

### 6.1. Economia de Tokens na Fase Beta

6.1.1. Cada novo Usuário recebe um saldo inicial gratuito de **10 (dez) Tokens NEO MATRIX**.

6.1.2. Cada execução de Job consome **2 (dois) Tokens**, independentemente do número de shots configurados.

6.1.3. Tokens não utilizados não expiram enquanto a conta estiver ativa durante a fase beta.

6.1.4. **Não há venda de tokens nesta fase** — o Serviço é inteiramente gratuito.

### 6.2. Aquisição de Tokens (INDISPONÍVEL NA FASE BETA)

6.2.1. A funcionalidade de compra de tokens está **desativada** durante a fase beta.

6.2.2. **Não há processamento de pagamentos** nesta fase.

6.2.3. Quando o Serviço sair da fase beta e a compra de tokens for habilitada, novos Termos de Uso serão apresentados com as condições comerciais, e o usuário precisará aceitar para continuar utilizando.

### 6.3. Política de Reembolso

6.3.1. Não aplicável durante a fase beta, pois não há cobrança.

---

## 7. CALIBRAÇÃO COMPARTILHADA (SPAM CACHE)

7.1. O Serviço utiliza técnica de calibração SPAM para melhorar a fidelidade dos resultados.

7.2. A primeira execução em determinado backend pode incluir 1 (um) disparo adicional de calibração, cujo custo de QPU é suportado pela conta IBM do Usuário que iniciou a chamada.

7.3. Os dados de calibração (matrizes t00/t11) são:
   - (a) Armazenados em cache de memória por até 30 (trinta) minutos;
   - (b) Reutilizados entre requisições no mesmo backend;
   - (c) Compartilháveis entre diferentes Usuários.

7.4. Os dados de calibração são propriedades estatísticas do backend IBM, não constituindo dados pessoais ou informações proprietárias do Usuário.

---

## 8. CIRCUITOS QUÂNTICOS E RESULTADOS

### 8.1. Não Armazenamento de Circuitos

8.1.1. A NEO MATRIX declara que os circuitos quânticos (código QASM3) submetidos pelo Usuário **NÃO são armazenados** em qualquer meio persistente.

8.1.2. Os circuitos são processados exclusivamente em memória durante a execução do Job.

### 8.2. Propriedade dos Resultados

8.2.1. O Usuário é titular exclusivo dos resultados gerados por seus Jobs, incluindo valores de fidelidade, contagens e demais outputs.

8.2.2. A NEO MATRIX reserva-se o direito de utilizar **métricas agregadas e anonimizadas** para fins estatísticos, de marketing ou aprimoramento do Serviço, tais como: "fidelidade média obtida no backend X foi Y%".

8.2.3. Nenhum resultado individual identificável será divulgado sem consentimento expresso do Usuário.

### 8.3. Responsabilidade sobre Resultados

8.3.1. Os resultados fornecidos têm caráter meramente informativo e experimental.

8.3.2. O Usuário é exclusivamente responsável por validar independentemente os resultados antes de utilizá-los em aplicações críticas, comerciais, científicas ou de qualquer natureza.

---

## 9. PROPRIEDADE INTELECTUAL E SEGREDO COMERCIAL

### 9.1. Direitos da NEO MATRIX

9.1.1. O Pipeline de Mitigação, algoritmos, código-fonte, documentação, marca "Smith Program", marca "NEO MATRIX" e demais elementos do Serviço são de propriedade exclusiva da NEO MATRIX, protegidos pela Lei nº 9.279/1996 (Lei de Propriedade Industrial), Lei nº 9.609/1998 (Lei do Software) e Lei nº 9.610/1998 (Lei de Direitos Autorais).

9.1.2. O acesso ao Serviço não confere ao Usuário qualquer direito de propriedade intelectual.

### 9.2. Segredo Comercial

9.2.1. O Usuário reconhece que os detalhes técnicos do Pipeline de Mitigação constituem **segredo comercial** da NEO MATRIX.

9.2.2. É expressamente vedado ao Usuário:
   - (a) Realizar engenharia reversa, descompilação ou desmontagem do Serviço;
   - (b) Tentar extrair, deduzir ou reconstruir os algoritmos proprietários;
   - (c) Publicar, divulgar ou compartilhar informações técnicas internas do Serviço;
   - (d) Utilizar o Serviço para desenvolver produto concorrente.

9.2.3. O Usuário recebe exclusivamente: fidelidade final, Job ID IBM (para auditoria), tempo de execução e contagens de resultado.

9.2.4. A violação desta cláusula sujeita o infrator às penalidades previstas na Lei nº 9.279/1996, Art. 195, especialmente incisos XI e XII (crimes de concorrência desleal), sem prejuízo de indenização por perdas e danos.

---

## 10. USO ACEITÁVEL

10.1. O Usuário compromete-se a utilizar o Serviço de forma lícita, ética e em conformidade com a legislação aplicável.

10.2. É expressamente vedado:
   - (a) Utilizar o Serviço para atividades ilegais ou fraudulentas;
   - (b) Tentar comprometer a segurança, integridade ou disponibilidade do Serviço;
   - (c) Realizar ataques de negação de serviço (DoS/DDoS);
   - (d) Acessar áreas restritas sem autorização;
   - (e) Automatizar acessos além dos limites de rate limiting estabelecidos;
   - (f) Revender ou sublicenciar o acesso ao Serviço;
   - (g) Violar direitos de terceiros, incluindo propriedade intelectual.

---

## 11. LIMITAÇÃO DE RESPONSABILIDADE E ISENÇÃO DE GARANTIAS

### 11.1. Serviço "Como Está" (AS IS)

11.1.1. O Serviço é fornecido **"NO ESTADO EM QUE SE ENCONTRA"** (AS IS) e **"CONFORME DISPONIBILIDADE"** (AS AVAILABLE), sem garantias de qualquer natureza, expressas ou implícitas.

11.1.2. **Por se tratar de fase beta gratuita**, a NEO MATRIX não garante:
   - (a) Disponibilidade ininterrupta ou livre de erros;
   - (b) Melhoria de fidelidade em qualquer caso específico;
   - (c) Adequação a fins específicos do Usuário;
   - (d) Precisão, confiabilidade ou integridade dos resultados;
   - (e) Continuidade do Serviço.

### 11.2. Exclusão de Responsabilidade

11.2.1. A NEO MATRIX não será responsável por:
   - (a) Danos indiretos, incidentais, consequenciais, punitivos ou especiais;
   - (b) Lucros cessantes, perda de dados ou interrupção de negócios;
   - (c) Danos decorrentes de uso comercial, científico ou crítico dos resultados;
   - (d) Falhas, erros ou indisponibilidade dos backends IBM Quantum;
   - (e) Atos de terceiros, caso fortuito ou força maior;
   - (f) Descontinuação do Serviço durante a fase beta.

### 11.3. Limitação de Indenização

11.3.1. Por se tratar de serviço gratuito em fase beta, **não há obrigação de indenização** por parte da NEO MATRIX, exceto em casos de dolo ou má-fé comprovados.

### 11.4. Exceções Legais

11.4.1. As limitações acima não se aplicam quando vedadas por lei, especialmente nos casos de dolo ou culpa grave.

---

## 12. CLÁUSULA BETA — DESCONTINUAÇÃO E ALTERAÇÕES

### 12.1. Natureza Experimental

12.1.1. O Usuário reconhece e aceita que o Serviço está em **fase de desenvolvimento e teste (beta)**.

12.1.2. Nesta fase, o Serviço pode ser:
   - (a) **Descontinuado** a qualquer momento, sem aviso prévio;
   - (b) **Alterado** substancialmente em suas funcionalidades;
   - (c) **Suspenso** temporária ou permanentemente;
   - (d) **Migrado** para nova infraestrutura ou domínio.

### 12.2. Ausência de Obrigação de Continuidade

12.2.1. A NEO MATRIX **não se obriga** a manter o Serviço ativo ou disponível por qualquer período.

12.2.2. A descontinuação do Serviço não gera direito a indenização, compensação ou restituição de qualquer natureza.

### 12.3. Backup de Dados

12.3.1. O Usuário é responsável por manter backup de quaisquer dados de sua importância.

12.3.2. Em caso de descontinuação, a NEO MATRIX envidará esforços razoáveis para notificar os usuários, mas **não garante** aviso prévio.

---

## 13. SUSPENSÃO E CANCELAMENTO

### 13.1. Pela NEO MATRIX

13.1.1. A NEO MATRIX pode suspender ou cancelar a conta do Usuário, imediatamente e sem aviso prévio, em caso de:
   - (a) Violação destes Termos ou da Política de Privacidade;
   - (b) Uso indevido, abusivo ou fraudulento do Serviço;
   - (c) Tentativa de comprometer a segurança do Serviço;
   - (d) Solicitação de autoridade competente;
   - (e) Inatividade superior a 12 (doze) meses;
   - (f) Descontinuação do Serviço.

### 13.2. Pelo Usuário

13.2.1. O Usuário pode solicitar o cancelamento de sua conta a qualquer momento através do Serviço ou do canal de suporte.

13.2.2. Após o cancelamento:
   - (a) Tokens não utilizados serão perdidos;
   - (b) Dados pessoais serão tratados conforme a Política de Privacidade e a LGPD.

---

## 14. TRANSFERÊNCIA INTERNACIONAL DE DADOS

14.1. O Usuário reconhece e consente que, ao utilizar o Serviço com backends IBM Quantum:
   - (a) Seus circuitos quânticos e parâmetros de execução serão transmitidos para servidores da IBM Corporation localizados em diversos países;
   - (b) A NEO MATRIX não controla o tratamento de dados realizado pela IBM.

14.2. A NEO MATRIX adota as seguintes garantias para transferências internacionais (LGPD, Art. 33):
   - (a) Transferência para países com nível adequado de proteção;
   - (b) Cláusulas contratuais padrão quando aplicável;
   - (c) Cooperação com autoridades competentes.

---

## 15. COMUNICAÇÕES

15.1. A NEO MATRIX poderá enviar comunicações ao Usuário através do e-mail cadastrado, incluindo:
   - (a) Notificações de segurança e incidentes;
   - (b) Alterações nos Termos ou Política de Privacidade;
   - (c) Informações sobre o Serviço;
   - (d) Aviso de descontinuação ou alteração do Serviço;
   - (e) Comunicações de marketing (com opção de opt-out).

15.2. O Usuário é responsável por manter seu e-mail atualizado.

---

## 16. ALTERAÇÕES NOS TERMOS

16.1. A NEO MATRIX pode alterar estes Termos a qualquer momento.

16.2. Para alterações materiais, o Usuário será notificado através de:
   - (a) E-mail para o endereço cadastrado; e/ou
   - (b) Aviso destacado no dashboard do Serviço.

16.3. **Na transição da fase beta para versão comercial com cobrança**, o Usuário precisará aceitar expressamente os novos Termos para continuar utilizando o Serviço.

16.4. Caso não concorde com as alterações, o Usuário poderá cancelar sua conta.

---

## 17. DISPOSIÇÕES GERAIS

### 17.1. Integralidade

17.1.1. Estes Termos, juntamente com a Política de Privacidade, constituem o acordo integral entre as partes, substituindo quaisquer entendimentos anteriores.

### 17.2. Independência das Cláusulas

17.2.1. Se qualquer disposição destes Termos for considerada inválida ou inexequível, as demais permanecerão em pleno vigor.

### 17.3. Tolerância

17.3.1. A tolerância da NEO MATRIX quanto a eventual descumprimento não implica renúncia ou novação.

### 17.4. Cessão

17.4.1. O Usuário não pode ceder ou transferir seus direitos ou obrigações sem consentimento prévio por escrito da NEO MATRIX.

17.4.2. A NEO MATRIX pode ceder livremente este contrato em caso de constituição de pessoa jurídica, fusão, aquisição ou venda de ativos.

---

## 18. LEGISLAÇÃO APLICÁVEL E FORO

18.1. Estes Termos são regidos pelas leis da República Federativa do Brasil.

18.2. Fica eleito o foro da Comarca de São Paulo/SP, com exclusão de qualquer outro, por mais privilegiado que seja, para dirimir quaisquer questões oriundas destes Termos.

18.3. Para Usuários consumidores nos termos do Código de Defesa do Consumidor, prevalecerá o foro de seu domicílio, conforme Art. 101, I, do CDC.

---

## 19. CONTATO E ENCARREGADO DE DADOS

19.1. **Encarregado de Proteção de Dados (DPO)**:
   - Nome: Neo Matrix Quantum Solutions
   - E-mail: dpo@neomatrixqs.com

19.2. **Suporte ao Cliente**:
   - E-mail: contato@neomatrixqs.com

19.3. **Contato Geral**:
   - E-mail: contato@neomatrixqs.com

---

## 20. DECLARAÇÃO DE ACEITE

Ao clicar em "Aceito" ou "Criar Conta", ou ao utilizar o Serviço, o Usuário declara:

- [  ] Li e compreendi integralmente os Termos de Uso.
- [  ] Li e compreendi integralmente a Política de Privacidade.
- [  ] Tenho capacidade legal para contratar.
- [  ] Concordo com o tratamento de meus dados pessoais conforme descrito na Política de Privacidade.
- [  ] Compreendo que o Serviço está em **fase beta gratuita** e pode ser descontinuado sem aviso prévio.
- [  ] Compreendo que, caso o Serviço passe a ter cobrança futuramente, precisarei aceitar novos Termos de Uso.

---

**Neo Matrix Quantum Solutions**

Última atualização: 22 de julho de 2026

---

*Este documento foi elaborado em conformidade com a Lei nº 13.709/2018 (LGPD), Lei nº 8.078/1990 (CDC), Lei nº 12.965/2014 (Marco Civil da Internet) e demais legislações aplicáveis.*
