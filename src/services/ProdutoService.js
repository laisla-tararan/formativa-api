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

    async cadastrarProduto(dados){
        const {nome, descricao, preco, categoria, disponivel, imagem} = dados

        if(!nome || !descricao || preco === undefined){
            throw{
                status: 400,
                mensagem: 'Nome, descrição e preço são obrigatórios.'
            }
        }

        if (isNaN(preco) || Number(preco) <= 0) {
            throw {
                status: 400,
                mensagem: "Preço deve ser um número positivo",
            };
        }

        const novoProduto = {
            nome: nome.trim(),
            descricao: descricao.trim(),
            preco,
            categoria: categoria || null, 
            disponivel: disponivel !== undefined ? disponivel : true,
            imagem: imagem || null
        }

        const resultado = await ProdutoRepository.cadastrarProduto(novoProduto)

        return{
            sucesso: true,
            mensagem: 'Produto cadastrado com sucesso.',
            id: resultado
        }
    }

    async atualizarProduto(id, dados = {}) {        
        if (!id || isNaN(id)) {
            throw {
                status: 400,
                mensagem: 'ID inválido.'
            };
        }

        const produtoId = await ProdutoRepository.buscarProdutoPorId(id);

        if (!produtoId) {
            throw {
                status: 404,
                mensagem: 'Produto não encontrado.'
            };
        }

        // 1. Extração das propriedades de 'dados' (evita que fiquem 'undefined')
        const { nome, descricao, preco, categoria, disponivel, imagem } = dados;

        const produtoAtualizado = {};

        // 2. Validações ajustadas de forma segura com '&&'
        if (nome !== undefined && nome !== null && nome.trim() !== '') {
            produtoAtualizado.nome = nome.trim();
        }

        if (descricao !== undefined && descricao !== null) {
            produtoAtualizado.descricao = descricao.trim();
        }

        if (preco !== undefined && preco !== null && preco !== '') {
            if (isNaN(preco) || Number(preco) <= 0) {
                throw {
                    status: 400,
                    mensagem: "Preço deve ser um número positivo",
                };
            }
            produtoAtualizado.preco = Number(preco);
        }

        if (categoria !== undefined) produtoAtualizado.categoria = categoria;
        if (disponivel !== undefined) produtoAtualizado.disponivel = disponivel;
        if (imagem !== undefined && imagem !== null) produtoAtualizado.imagem = imagem;

        if (Object.keys(produtoAtualizado).length === 0) {
            throw {
                status: 400,
                mensagem: 'Nenhum dado válido enviado para atualização.'
            };
        }

        await ProdutoRepository.atualizarProduto(id, produtoAtualizado);

        return {
            sucesso: true,
            mensagem: 'Produto atualizado.'
        };
    }

    async deletarProduto(id){
        if(!id || isNaN(id)){
            throw{
                status: 400,
                mensagem: 'ID inválido.'
            }
        }

        const idProduto = await ProdutoRepository.buscarProdutoPorId(id)

        if(!idProduto){
            throw{
                status: 404,
                mensagem: 'Produto não encontrado'
            }
        }

        await ProdutoRepository.apagarProduto(id)

        return{
            sucesso: true,
            mensagem: 'Produto apagado.'
        }
    }
}

module.exports = new ProdutoService()