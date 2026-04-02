const pool = require('./config/database.js'); //1. importa o pool do arquivo database.js.

pool.getConnection((err, connection) => {
    if(err){
        console.error('Erro ao conectar ao banco:', err) //2. sinaliza o erro, caso não consiga conversar com o banco de dados.
        process.exit(1) //3. encerra a conexão.
    }
    console.log('Conectado ao MySQL') //4. sinaliza que a conexão aconteceu corretamente.
    connection.release()
});

const app = require('./app.js'); //5. cria a conexão com o app.js.
const PORT = 3000;

app.listen(PORT, () => {
    console.log('Servidor Rodando...')
})