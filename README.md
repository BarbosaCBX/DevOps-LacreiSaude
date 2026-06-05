# DevOps-LacreiSaude
Desafio técnico - DevOps lacrei saúde, aplicação nodejs, um pipeline de deploy seguro, escalável e eficiente, que permita a publicação de aplicações em ambientes de staging e produção.

# DevOps Challenge - API Rest & CI/CD Pipeline

Este repositório contém uma API Node.js conteinerizada com Docker e um fluxo completo de CI/CD voltado para a AWS, utilizando GitHub Actions.

## Arquitetura e Fluxo de CI/CD

O fluxo do pipeline garante que nenhuma imagem quebrada chegue aos ambientes de Staging ou Produção.

### Erros Encontrados & Soluções durante o Setup:

*Erro:* `tag invalid: The image tag 'latest' already exists (...) and cannot be overwritten because the tag is immutable.`
  * *Contexto:* Ao tentar realizar o segundo deploy, o pipeline falhou no passo de envio para o Amazon ECR. Isso ocorreu porque o repositório foi configurado na AWS com a opção de **Tag Immutability (Imutabilidade de Tags)** ativada.
  * *Solução & Decisão Técnica:* Em vez de desativar a segurança na AWS para aceitar a tag `latest`, optou-se por **manter a imutabilidade ativa** (prática recomendada de mercado). O arquivo do pipeline (`deploy.yml`) foi corrigido para remover a geração da tag genérica `latest`. Agora, o pipeline gera e envia imagens utilizando *única e exclusivamente* o hash do commit do Git (`${{ github.sha }}`).