# 🛡️ Bradesco - Front-End

# Objetivo do Documento
Documento criado para auxiliar no **planejamento e desenvolvimento da interface do Projeto de Antifraude Bancária**, com foco em simulação de **transações via PIX** e **monitoramento antifraude em tempo real**.

---

# Propósito

## Problema
De acordo com fontes como o **Banco Central**, o uso crescente do **PIX** tem sido acompanhado por um aumento alarmante nas **fraudes e golpes**.

## Impacto
Essas fraudes geram:
- Perdas financeiras significativas para as vítimas;  
- Crise de confiança no sistema de pagamento instantâneo;  
- Aumento de custos operacionais para instituições bancárias (atendimento, ressarcimentos, etc.);  
- Danos reputacionais à marca.

## Oportunidade
Desenvolver uma **interface interativa** capaz de:
- Simular o ambiente bancário digital;  
- Permitir o envio e recebimento de PIX entre usuários;  
- Exibir em tempo real os alertas e bloqueios realizados pelo sistema antifraude.

---

# Produto / Escopo

## Produto
Interface bancária e **dashboard de monitoramento antifraude**, conectados à API do CyberBank Security, com visual intuitivo e comunicação em tempo real.

---

# Funcionalidades

## Para o Cliente
- [ ] Simulação de criação de conta bancária;  
- [ ] Cada usuário possui um número de conta e senha personalizados;  
- [ ] Login individual com acesso às funcionalidades bancárias;  
- [ ] Exibição de saldo e histórico de transações;  
- [ ] Funcionalidade de **PIX** entre usuários com chaves cadastradas;  
- [ ] Notificações de segurança e alertas em tempo real.

## Para Bancos, Instituições Financeiras e Fintechs
- [ ] Dashboard com **monitoramento ao vivo** das transações;  
- [ ] Exibição em tempo real do **valor prevenido de fraudes**;  
- [ ] **Bloqueio manual de contas** suspeitas;  
- [ ] Opção de **ativar/desativar o software**;  
- [ ] Criação e configuração de **regras personalizadas de segurança**.

---

# Tecnologias Utilizadas
- **HTML5 / CSS3 / JavaScript**   
- **Axios** (integração com API)   
- **TailwindCSS** (estilização)

---

# Estrutura do Projeto
- **/pages** – Páginas principais (Login, Dashboard, Conta, PIX).  
- **/components** – Componentes reutilizáveis.  
- **/services** – Comunicação com a API.  
- **/assets** – Ícones, imagens e estilos.  

---

# Comunicação com a API
O front-end se conecta à API do projeto:


---

# Equipe

| Função | Nome | Responsabilidade |
|--------|------|------------------|
| Front-End Developer | **Thiago Rocha** | Desenvolvimento da interface bancária e dashboard |
| Arquiteto do Software & Back-End Developer | **Gustavo Félix Morais** | Integração e lógica de comunicação entre front e back |
| DevOps / Infraestrutura | **Geovanny Wilson** | Ambiente de desenvolvimento e repositório |
| QA Tester | **Yasmim Leal** | Garantia de qualidade, testes e validação das entregas |

---

# Licença
Este projeto é de uso interno e educacional.  
Todos os direitos reservados à equipe **CyberBank Security**.
