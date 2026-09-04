const express = require('express');
const cors = require('cors');
const env = require('./config/env');

const app = express();

app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;
