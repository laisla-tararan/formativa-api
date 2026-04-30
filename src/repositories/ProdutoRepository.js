const pool = require('../config/database')

class ProdutoRepository{
    async listarProdutos(){
        const listaProdutos = await pool.query('SELECT * FROM produto') //faz a conexão com os dados do banco de dados.
        return listaProdutos
    }
    async buscarProdutoPorId(id){
        const mostrarProduto = await pool.query('SELECT * FROM produto WHERE id = ?', [id])
        return mostrarProduto[0]
    }
    async cadastrarProduto(dadosDoProduto){
        const resultadoDoCadastro = await pool.query('INSERT INTO produto SET ?', [dadosDoProduto])
        return resultadoDoCadastro.insertId
    }
    async atualizarProduto(id, dadosDoProduto){
        const produtoAtualizado = await pool.query('UPDATE produto SET ? WHERE id = ?', [dadosDoProduto, id])
        return produtoAtualizado.insertId
    }
    async apagarProduto(id){
        const produtoExcluido =  await pool.query('DELETE FROM produto WHERE id = ?')
        return true
    }
}

module.exports = new ProdutoRepository();