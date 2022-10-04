const express = require('express');
const { json } = require('express/lib/response');
const bcrypt = require('bcrypt')
const router = express.Router()
const jwt = require('jsonwebtoken')
const fs = require('fs');

const dadosLocais = JSON.parse(fs.readFileSync("dados.json"));
router.post("/login", (req, res) => {
   const { email, senha } = req.body
   if (!email || !senha) {
      res.send(422).send("Você deve definir Email e Senha")
   }

   const usuario = dadosLocais.find((user) => user.email === email)
   if (!usuario) {
      res.status(401).send("Email ou senha incorreta")
   }

  if(!bcrypt.compareSync(senha, usuario.hash)) {
   res.status(401).send("Email ou senha incorreta")
  }

  res.status(200).send({
   email: email,
   nome: usuario.nome,
   dados: usuario.dados
  })

});


router.post("/criar", (req, res) => {
   const { nome, email, senha } = req.body
   if (!email || !senha) {
      res.status(422).send("Você deve informar email e senha")
   } else if (dadosLocais.find((usuario) => usuario.nome === nome || usuario.email === email)) {
      res.status(401).send("Usuário ou Email já está sendo ultilizado")
   } else {
      var dadosUsuario = {
         id: Math.floor(Math.random() * 999999999),
         nome: nome,
         email: email,
         dados: {},
      }
      const token = jwt.sign({id: dadosUsuario.id }, "KEY_RIVALDO")
      dadosUsuario.token = token
      const salt = bcrypt.genSaltSync()
      dadosUsuario.hash = bcrypt.hashSync(senha, salt)      
      dadosLocais.push(dadosUsuario)
      const dadosConvertido = JSON.stringify(dadosLocais, null, 2)
      fs.writeFileSync("dados.json", dadosConvertido)

   }
   res.send(200).send({
      email: email,
      nome: nome
   })

});

module.exports = router;