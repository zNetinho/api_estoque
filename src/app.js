const express = require('express')
const cors = require('cors');
const main = require('./db/conn')
const app = express()
const port = 3001
const routes = require("./routes/router");
const handleNotFound = require('./middlewares/handleNotFound');
const manipuladorDeErros = require('./middlewares/handleErrors');

app.use(cors());
app.use(express.json());

app.use("/api", routes)

app.use((erro, req, res, next) => {
  console.log(erro)
  res.status(500).send({ message: "Erro interno no servidor"})
});

// Registra o uso do middleware de Erros
app.use(manipuladorDeErros);
app.use(handleNotFound);

app.listen(port, () => {
  console.log(`O Servidor está online na porta:${port}`)
  main();
})

