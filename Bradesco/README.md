# 🛡️ Bradesco - Front-End

Objetivo do Documento
Documento criado para auxiliar no planejamento e desenvolvimento do Projeto de Antifraude Bancária, com foco em transações via PIX.

Propósito
Problema
De acordo com fontes como o Banco Central, o uso crescente do PIX tem sido acompanhado por um aumento alarmante nas fraudes e golpes.

Impacto
Essas fraudes geram:

Perdas financeiras significativas para as vítimas;
Crise de confiança no sistema de pagamento instantâneo;
Aumento de custos operacionais para instituições bancárias (atendimento, ressarcimentos, etc.);
Danos reputacionais à marca.
Oportunidade
Desenvolver um Sistema de Antifraude em tempo real capaz de:

Detectar, alertar e mitigar transações suspeitas;
Proteger o capital das instituições financeiras;
Aumentar a segurança e confiança dos clientes.
Produto / Escopo
Produto
Software voltado à detecção e prevenção de fraudes em transações via PIX, utilizando análise sazionalidade e monitoramento em tempo real, promovendo maior segurança e confiabilidade ao sistema bancário digital.

Funcionalidades Para o Cliente
[x] Interface bancária simulando a criação de uma conta bancária completa;
[x] Cada usuário possui um número de conta único e senha personalizada;
[x] Login individual com acesso às funcionalidades bancárias;
[x] Exibição de saldo em conta em tempo real;
[x] Funcionalidade de PIX entre usuários com chaves cadastradas em tempo real.
[x] Para Bancos, Instituições Financeiras e Fintechs
[x] Compliance de Analise de Pré Registro;
[x] Exibição de todas as Contas Bancárias**;
[x] Indice de Risco de cada conta;
[x] Login Individual para cada Administrador com interface Bancária também**.

Funcionalidades do Software (Core)
[x] Motor de Análise Comportamental (Machine Learning):
[x] Analisa histórico de transações, horários habituais, valores médios, contatos frequentes e perfil de uso para criar um perfil de risco individualizado.
[x] Ação de Alerta: Sinaliza transações que se desviem do comportamento normal do usuário (ex: alto valor, nova localização, horário incomum). Solicita autenticação adicional antes de confirmar o PIX.
[x] Sistema de Regras Heurísticas e Listas Negras: Verifica transações contra regras de negócio e listas de chaves PIX reportadas como fraudulentas.
[x] Ação de Bloqueio Automático:Bloqueia transações de alto risco imediato (ex: chave em blacklist ou valor acima do limite).
[x] Notificações em Tempo Real: Informa usuário e banco sobre qualquer ação de alerta, bloqueio ou análise.
[x] MicroServço de API Mailgun para Envios de e-mail reais de contas aprovadas e para aviso de possiveis transaçõs fraudelendas enviando o token de segurança onde o cliente precisa inserir para realmente prosseguir com a transação.
[x] Token Transacional que é enviado no e-mail do cliente unico para cada transação e expira após ser utilizado 

Equipe
Função	Nome	Responsabilidade
Arquiteto do Software & Back-End Developer | Gustavo Félix Morais	| Arquitetura do sistema e desenvolvimento da API
Front-End Developer	| Thiago Rocha & Gustavo Félix Morais |	Desenvolvimento da interface bancária e dashboard
DevOps / Infraestrutura |	Geovanny Wilson |	Ambiente de desenvolvimento e repositório
DBA |	Rômulo Giardini |	Administração e modelagem do banco de dados
QA Tester |	Yasmim Leal | Garantia de qualidade, testes e validação das entregas Licença

Este projeto é de uso interno e educacional. Todos os direitos reservados à equipe CyberBank Security.uipe **CyberBank Security**.
