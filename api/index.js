import express from 'express'

const app = express()
const port = 4000

app.use(express.json())//irá fazer o parse de arquivos 
//Rotas de conteudo publico 

app.use('/', express.static('public'))

app.get('/api', (req, res) =>{
    res.status(200).json({
        message: "API fatec funcinando",
        version: "1.0.0"
    })
})

app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`)
})