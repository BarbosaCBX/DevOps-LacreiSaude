const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Configuração de CORS restritiva (Segurança)
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*';
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rota obrigatória de /status (Healthcheck) Teste de Pipeline v2
app.get('/status', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.listen(PORT, () => {
  console.log(`Aplicativo rodando na porta ${PORT}`);
});