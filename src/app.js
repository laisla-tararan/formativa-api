const express = require('express')
const pool = require('./server.js')

const app = express()
app.use(express.json())

const queryAsync = (sql, values = []) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, values, (err, results) => {
            if (err) reject(err)
            else resolve(results)
        })
    })
}

function ValidarIdProduto(id, res){
    if(!id || isNaN(id)){
        return res.status(400).json({
            sucesso: false,
            mensagem: 'ID de produto inválido'
        });
        return false
    }
    return true
}

app.get('/', (req, res) => {
    res.send("Restaurante Sabor & Saber")
})

app.get('/produtos', async (req, res) => {
    try {
        const produtos = await queryAsync('SELECT * FROM produto ORDER BY id DESC');
        res.json({
            sucesso: true,
            dados: produtos,
            total: produtos.length
        });
    } catch (erro) {
        console.error('Erro ao listar produtos:', erro);
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar produtos',
            erro: erro.message
        });
    }
})

app.get('/produtos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if(!ValidarIdProduto(id, res)) return

        const produto = await queryAsync('SELECT * FROM produto WHERE id = ?', [id]);

        if (produto.length === 0){
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Produto não encontrado'
            });
        }
        res.json({
            sucesso: true,
            dados: sala[0]
        });

    } catch (erro) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao buscar produto',
            erro: erro.message
        });
    }
})

app.post('/produtos', async (req, res) => {
    try { 
        let {nome, descricao, preco, disponivel} = req.body

        if(!nome || !descricao || !preco || !disponivel){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Os dados são obrigatórios.'
            })
        }

        if(typeof preco !== 'number' || preco <= 0){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Preço deve ser um número positivo.'
            })
        }

        if (typeof disponivel !== 'boolean') {
            disponivel = (disponivel === 'true' || disponivel === 1 || disponivel === '1');
        }

        const novoProduto = {
            nome: nome.trim(),
            descricao: descricao.trim(),
            preco,
            disponivel
        }

        const resultado = await queryAsync('INSERT INTO produto SET ?', [novoProduto])

        res.status(201).json({
            sucesso: true,
            mensagem: 'Produto cadastrado com sucesso.',
            id: resultado.insertId 
        })
    } catch (erro) { 
        console.error('Erro ao salvar produto:', erro)

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao salvar produto.',
            erro: erro.message
        })
    }
} )

app.put('/produtos/:id', async (req, res) => {
    try {
        const {id} = req.params
        let {nome, descricao, preco, disponivel} = req.body

        if(!nome || !descricao || !preco || !disponivel){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Os dados são obrigatórios.'
            })
        }

        const produtoExiste = await queryAsync('SELECT * FROM produto WHERE id = ?', [id])
        if(produtoExiste.length === 0){
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Produto não encontrado.'
            })
        }

        const produtoAtualizado = {}

        if(nome !== undefined) produtoAtualizado.nome = nome.trim()
        if(descricao !== undefined) produtoAtualizado.descricao = descricao.trim()
        if (preco !== undefined) {
            if (typeof preco !== 'number' || preco <= 0) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Preço deve ser um número positivo.'
                });
            }
            produtoAtualizado.preco = preco; 
        }
        if (disponivel !== undefined) {
            if (typeof disponivel !== 'boolean') {
                disponivel = (disponivel === 'true' || disponivel === 1 || disponivel === '1');
            }
            produtoAtualizado.disponivel = disponivel; 
        }

        if(Object.keys(produtoAtualizado).length === 0){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Nenhum campo para atualizar'
            })
        }

        await queryAsync('UPDATE produto SET ? WHERE id = ?',[produtoAtualizado, id])
        res.json({
            sucesso: true,
            mensagem: 'Produto atualizado.'
        })

    } catch (erro) {
        console.error('Erro ao atualizar produto:', erro)
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao atualizar produto.',
            erro: erro.message
        })
       
    }
})

app.delete('/produtos/:id', async (req, res) => {
    try {
        const {id} = req.params

        if(!id || isNaN(id)){ 
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID de produto inválido'
            })
        }

        const produtoExiste = await queryAsync('SELECT * FROM produto WHERE id = ?', [id])

        if(produtoExiste.length === 0){
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Produto não encontrado.'
            })
        }

        await queryAsync('DELETE FROM produto WHERE id = ?', [id])

        res.status(200).json({
            sucesso: true,
            mensagem: 'Produto apagado.'
        })
    } catch (erro) {
        console.error('Erro ao apagar produto:', erro)
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao apagar produto.',
            erro: erro.message
        })
    }
})

module.exports = app;