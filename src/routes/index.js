const express = require('express')
const router = express.Router()

const produtoRoutes = require('./ProdutoRoutes')

router.get('/', (req, res) => {
    res.json({
        mensagem: 'API SABOR DIGITAL',
        versão: '5.0.8'
    })
})

router.use('/produtos', produtoRoutes)

module.exports = router;