const express = require('express')
const app = express()
const router = require("./routes/login")
const auth = require("./services/auth")

app.use(express.json());
app.use(router);



app.get("/", auth, (req, res) => {
    res.status(200).send({
        nome: req.user.nome,
        email: req.user.email,
        dados: req.user.dados,
    })
})


app.listen(3069, () => {
    console.log("Servidor está sendo executado na porta 3069")
})