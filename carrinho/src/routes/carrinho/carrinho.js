const express = require("express")
const route_carrinho = express.Router()
const data = require("../../database/config.js")

route_carrinho.get("/listar",(req,res) => {
    data.query("select f.foto1,t.nometitulo,t.autor,c.quantidade,p.precoatual,p.precodesconto,t.idtitulo,c.total FROM saraivalivrodb.fotos f INNER JOIN saraivalivrodb.titulos t ON f.idfotos = t.idfoto INNER JOIN saraivacarrinhodb.carrinho c ON t.idtitulo = c.idproduto INNER JOIN saraivalivrodb.precos p ON p.idpreco = t.idpreco", (error, dados) => {
        if (error) {
            return res.status(500).send({msg: "Erro ao carregar os dados"})
        }
        res.status(200).send({msg: "Ok",payload:dados})
    })
})

route_carrinho.get("/listar/:id",(req,res) => {
    //insert_register(id_usuario,date_time,1,`/listar/${req.params.id}`,remote_data.toString)
    //data.query("select * from carrinho where idusuario=?",req.params.id,(error,dados) => {
    data.query("select f.foto1,t.nometitulo,t.autor,c.quantidade,p.precoatual,p.precodesconto,t.idtitulo,c.idcarrinho,c.total FROM saraivalivrodb.fotos f INNER JOIN saraivalivrodb.titulos t ON f.idfotos = t.idfoto INNER JOIN saraivacarrinhodb.carrinho c ON t.idtitulo = c.idproduto INNER JOIN saraivalivrodb.precos p ON p.idpreco = t.idpreco WHERE c.idusuario=?",req.params.id,(error,dados) => {
        if (error) {
            return res.status(500).send({msg:"Erro ao selecionar os dados"})
        }
        res.status(200).send({msg:"Ok", payload:dados})
    })
})

route_carrinho.get("/exibir/:id",(req,res) => {
    //insert_register(id_usuario,date_time,1,`/listar/${req.params.id}`,remote_data.toString)
    //data.query("select * from carrinho where idusuario=?",req.params.id,(error,dados) => {
    data.query("select sum(c.total) as total FROM carrinho c WHERE idusuario=?",req.params.id,(error,dados) => {
        if (error) {
            return res.status(500).send({msg:"Erro ao selecionar os dados"})
        }
        res.status(200).send({msg:"Ok", payload:dados})
    })
})

route_carrinho.get("/exibirtotal",(req,res) => {
    //insert_register(id_usuario,date_time,1,`/listar/${req.params.id}`,remote_data.toString)
    //data.query("select * from carrinho where idusuario=?",req.params.id,(error,dados) => {
    data.query("select sum(c.total) as total FROM carrinho c",(error,dados) => {
        if (error) {
            return res.status(500).send({msg:"Erro ao selecionar os dados"})
        }
        res.status(200).send({msg:"Ok", payload:dados})
        console.log(`resultado: ${dados}`)
    })
})

route_carrinho.post("/adicionar",(req,res) => {
    data.query("insert into carrinho set ?",req.body,(error,result) => {
        if (error) {
            res.status(500).send({msg:"Erro ao tentar adicionar ao carrinho"})
        }
        res.status(201).send({msg:"Ok",payload:result})
    })
})

route_carrinho.post("/adicionarlivro/:id",(req,res) => {
    data.query("select p.precoatual,p.precodesconto,t.idtitulo FROM saraivalivrodb.titulos t INNER JOIN saraivalivrodb.precos p ON p.idpreco = t.idpreco WHERE t.idtitulo=?;",req.params.id, (err, dados) => {
        if (err) {
            return res.status(500).send({msg: "Erro ao carregar os dados"})
        }
        //res.status(200).send({msg: "Ok",payload:dados})
        console.log(dados[0].precoatual)
        data.query(`INSERT INTO saraivacarrinhodb.carrinho (idproduto, idusuario, quantidade, total) VALUES (?, '1', '1', ${dados[0].precodesconto < 1 ? dados[0].precoatual : dados[0].precodesconto});`,[req.params.id],(error, result) => {
            if (error) {
                res.status(500).send({msg:"Erro ao tentar adicionar ao carrinho"})
                console.log(error)
            }
            res.status(201).send({msg:"Ok",payload:result})
        })
    })
})

route_carrinho.delete("/removerlivro/:id",(req,res) => {
    data.query("delete from saraivacarrinhodb.carrinho where idcarrinho=?",req.params.id,(err,dados) => {
        if (err) {
            return res.status(500).send({msg: "Erro ao carregar os dados"})
        }
        res.status(201).send({msg:"Ok",payload:dados})
    })
})

route_carrinho.put("/atualizarlivro/:id",(req,res) => {
    //console.log(req.body);
    data.query(`update saraivacarrinhodb.carrinho set quantidade = ${req.body.carrinhoQuantidade}, total = ${req.body.carrinhoTotal} where idcarrinho = ?`, req.params.id, (error, result) => {
        if (error) {
            return res.status(500).send({ msg: "Não foi possível atualizar o carrinho " +error})
        }
        res.status(200).send({ msg: "Update", payload: result })
    })
})

module.exports = route_carrinho


//INSERT INTO saraivacarrinhodb.carrinho (idproduto, idusuario, quantidade, total) VALUES ('?', '1', '1', '${dados.precodesconto < 1 ? dados.precoatual : dados.precodesconto}');