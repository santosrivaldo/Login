

const fs = require('fs');
const jwt = require('jsonwebtoken')
const dadosLocais = JSON.parse(fs.readFileSync("dados.json"));

module.exports = (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        res.status(401).send("O usuário precisa esta logado")
    }
    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, "KEY_RIVALDO", (err, payLoad) => {
        if (err) {
            res.status(401).send("Usuário não conectado")
            
        }
        const { id } = payLoad;
        const user = dadosLocais.find((user) => user.id === id)
        if (!user) {
            res.status(401).send("O usuário precisa estar logado")
        }
        req.user = user
        next()
    })
}