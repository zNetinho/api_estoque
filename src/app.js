const express = require('express')
const cors = require('cors');
const main = require('./db/conn')
const app = express()
const port = 3001
const routes = require("./routes/router")

app.use(cors());
app.use(express.json());

app.use("/api", routes)

app.listen(port, () => {
  console.log(`O Servidor está online na porta:${port}`)
  main();
})

