# Estágio 1: Build e Instalação de dependências
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production

# Estágio 2: Ambiente de Execução (Production-ready)
FROM node:20-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY . .

# Segurança: Executar como usuário não-privilegiado
USER node

EXPOSE 3000
ENV PORT=3000

CMD ["npm", "start"]