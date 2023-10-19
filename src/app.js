const express = require('express')
const main = require('./db/conn')
const app = express()
const port = 3000
const routes = require("./routes/router")

app.use(express.json());

app.use("/api", routes)

app.listen(port, () => {
  console.log(`O Servidor está online na porta:${port}`)
  main();
})

