const ProdutoRepository = require('../repositories/ProdutoRepository')

class ProdutoService {
    async listarProdutos(){
        const produtos = await ProdutoRepository.listarProdutos()

        return {
            sucesso: true, 
            dados: produtos,
            total: produtos.length
        }
    }
    async buscarProdutoPorId(id){
        if(!id || isNaN(id)){
            throw { 
                status: 400, 
                mensagem: 'ID inválido.' 
            }
        }
        
        const produto = await ProdutoRepository.buscarProdutoPorId(id)

        if(!produto){
            throw {
                status: 404,
                mensagem: 'Produto não encontrado'
            }
        }

        return {
            sucesso: true,
            dados: produto[0]
        }
    }
}