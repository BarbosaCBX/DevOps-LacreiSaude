# 🚀 DevOps Challenge - API Rest & Pipeline CI/CD na AWS

Este repositório contém uma API Node.js containerizada e um fluxo completo de Integração e Implantação Contínua (CI/CD) integrado à AWS (ECR/ECS Fargate) utilizando GitHub Actions, desenvolvido como parte do desafio técnico de DevOps.

🔗 **Link da aplicação em produção:** http://3.134.116.45:3000/status

---

## 🗺️ Arquitetura do Ambiente e Fluxo de CI/CD

A infraestrutura foi desenhada focando em alta disponibilidade, segurança e automação total.

### Detalhes da Infraestrutura na AWS:
1. **Rede & Containers (VPC/ECS):** A aplicação roda de forma *Serverless* utilizando o **AWS ECS com Fargate**, garantindo que não existam instâncias EC2 manuais para gerenciar.
2. **Ambientes:** Estrutura logicamente isolada preparada para suportar `staging` e `production` através do mapeamento de variáveis de ambiente do pipeline.

---

## 🛡️ Checklist de Segurança Aplicado

Seguindo os pilares do desafio, as seguintes práticas de segurança foram implementadas:
- [x] **Princípio do Menor Privilégio:** O usuário do IAM criado para o GitHub Actions possui permissões restritas e exclusivas para interagir com o ECR e o ECS do projeto.
- [x] **Segurança a nível de Container:** O `Dockerfile` utiliza *multi-stage build* para reduzir a superfície de ataque e o container **não roda como root**, utilizando o usuário padrão `USER node`.
- [x] **Gerenciamento de Secrets:** Nenhuma credencial, chave AWS ou token do Slack foi exposto no código fonte. Tudo é gerenciado via **GitHub Secrets** e injetado em runtime.
- [x] **CORS Restritivo:** A aplicação possui o middleware CORS configurado no `server.js` pronto para restringir origens via variável de ambiente.

---

## 🔄 Processo de Rollback Funcional

Para garantir a resiliência do ambiente e recuperação rápida em caso de falhas pós-deploy, adota-se a seguinte estratégia:

### Revert de Imagem Docker (Baseada em Git SHA)
Como o pipeline foi blindado para **não utilizar a tag `latest`** devido às políticas de imutabilidade do ECR, cada deploy está atrelado ao hash exclusivo do commit do Git (`${{ github.sha }}`).

* **Rollback via Git (Recomendado):**
  Basta efetuá-lo fazendo o revert do commit que gerou a falha direto na branch principal:
  ```bash
  git revert <commit_hash>
  git push origin main


* **Rollback Manual de Emergência (AWS CLI):**
  Caso precise mitigar uma falha imediatamente sem aguardar o pipeline:
  ```bash
  aws ecs update-service --cluster lacreisaude-cluster --service lacreisaude-service --task-definition lacreisaude-task:VERSION_ANTERIOR --force-new-deployment

---

🧠 Decisões Técnicas e Erros Encontrados

Decisões Técnicas:
    • AWS ECS Fargate: Optou-se por uma arquitetura serverless de containers para eliminar a sobrecarga operacional de gerenciar sistemas operacionais, permitindo foco total na escalabilidade da API.
    • Notificação via Slack: Implementação do bônus utilizando Incoming Webhooks injetados via variáveis de ambiente no Linux ($SLACK_URL) para garantir o isolamento do segredo e avisar o time de engenharia sobre deploys bem-sucedidos.

Erros Encontrados & Soluções:
• Ausência do Lockfile no Cache (package-lock.json):
    Problema: O pipeline falhou ao tentar otimizar o cache do Node pois o arquivo de trava não existia.
    Solução: Foi gerado o arquivo localmente via npm install e commitado no repositório, permitindo o uso seguro do npm ci no pipeline.

• Imutabilidade de Tags no ECR:
    Problema: Erro tag invalid: The image tag 'latest' already exists (...) and cannot be overwritten.
    Solução: Para respeitar a boa prática de segurança de imutabilidade ativada no ECR, removeu-se a tag genérica latest do pipeline. Agora o sistema utiliza estritamente o hash do commit do Git como tag única.

• Sintaxe do comando Curl no Linux:
    Problema: O passo do Slack quebrou com exit code 2 (no URL specified).
    Solução: A sintaxe do GitHub Actions foi ajustada para envelopar a secret do GitHub em uma variável de ambiente de bloco interna do runner (env:), protegendo a execução do comando com aspas duplas.
