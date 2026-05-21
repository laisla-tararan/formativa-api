const pool = require('../config/database')

class ProdutoRepository{
    async listarProdutos(){
        const [listaProdutos] = await pool.query('SELECT * FROM produto')
        console.log(listaProdutos) //faz a conexão com os dados do banco de dados.
        return listaProdutos
    }
    async buscarProdutoPorId(id){
        const mostrarProduto = await pool.query('SELECT * FROM produto WHERE id = ?', [id])
        return mostrarProduto
    }
    async cadastrarProduto(dadosDoProduto){
        const [resultadoDoCadastro] = await pool.query(
            'INSERT INTO produto SET ?',
            [dadosDoProduto]
        );
        return resultadoDoCadastro.insertId;
    }
    async atualizarProduto(id, dadosDoProduto){
        const camposProduto = []
        const dadoProduto = []

        for(const [key, value] of Object.entries(dadosDoProduto)){
            camposProduto.push(`${key} = ?`)
            dadoProduto.push(value)
        }

        if(camposProduto.length === 0) return null

        dadoProduto.push(id)

        const query = `UPDATE produto SET ${camposProduto.join(',')} WHERE id = ?`

        const resultado = await pool.query(query, dadoProduto)

        return resultado.affectedRows
    }
    async apagarProduto(id){
        const produtoExcluido =  await pool.query('DELETE FROM produto WHERE id = ?', [id])
        return true
    }
}

module.exports = new ProdutoRepository();