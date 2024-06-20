require("dotenv").config()
const express = require("express")
const router_personal = express.Router()
const data = require("../../database/config.js")
const verificar = require("../../middleware/verify_token.js")

router_personal.get("/listar",verificar,(req,res) => {
    data.query("select * from dadospessoais", (error,result) => {
        if (error) {
            return res.status(500).send({msg:"Erro ao carregar os dados"})
        }
        res.status(200).send({msg:"Ok",payload:result})
    })
})

router_personal.get("/listar/:cpf",verificar,(req,res) => {
    data.query("select * from dadospessoais where iddadospessoais=?",req.params.cpf,(error,result) => {
        if (error) {
            return res.status(500).send({msg:"Erro ao carregar os dados"})
        }
        res.status(200).send({msg:"Ok",payload:result})
    })
})

router_personal.post("/cadastrar",verificar,(req,res) => {
    data.query("insert into dadospessoais set ?",req.body,(error,result) => {
        if (error) {
            return res.status(500).send({msg:"Erro ao tentar cadastrar"})
        }
        res.status(201).send({msg:"Ok",payload:result})
    })
})

router_personal.put("/atualizar/:id",verificar,(req,res) => {
    data.query("update dadospessoais set ? where iddadospessoais=?",[req.body,req.params.id],(error,result) => {
        if (error) {
            return res.status(500).send({msg:"Erro ao tentar atualizar os dados"})
        }
        res.status(200).send({msg:"Ok",payload:result})
    })
})

module.exports = router_personal