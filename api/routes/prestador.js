//API REST dos prestadores
import exepress from 'express'
import { check, validationResult } from 'express-validator'
import {connectToDatabase} from '../utils/mongodb.js'

const router =  exepress.Router()
const {db, ObjectId} = await connectToDatabase()
const nomeCollection = 'prestadores'

const validaPrestador = [
    check('cnpj')
    .not().isEmpty().trim()
    .withMessage("É obrigatório informar o CNPJ")
    .isNumeric().withMessage("O CNPJ só deve conter números")
    .isLength({min: 14, max:14}).withMessage("O CNPJ deve ter 14 números"),
    check('razao_social')
    .not().isEmpty().trim()
    .withMessage("É obrigatório informar a razão social")
    .isAlphanumeric('pt-BR', {ignore:'/. '})
    .withMessage("A razão social não deve ter caracteres especiais")
    .isLength({min: 5}).withMessage("Razão muito curta. Mínimo de 5")
    .isLength({max: 200}).withMessage("Razão muito longa. Máximo de 200"),
    check('cnae_fiscal')
    .isNumeric().withMessage("O código do CNAE deve ser um número"),
    check('nome_fantasia').optional({nullable: true})
    
]

// GET /api/prestadores
// lista de todos os prestadores

router.get('/', async(req, res)=> {
    try{
        db.collection(nomeCollection).find().sort({razao: 1})
        .toArray((err, docs)=>{
            if(!err)
                res.status(200).json(docs)
        })
    }
    catch(err){
        res.status(500).json({
            errors: [{
                value: `${err.message}`,
                msg: 'Erro ao obter a listagem dos prestadores',
                param: '/'
            }]
        })
    }
})

// GET /api/prestadores/:id
// lista de todos os prestadores
router.get('/:id', async(req, res)=>{
    try{
        db.collection(nomeCollection).find({'_id': {$eq:  ObjectId(req.params.id)}})
        .toArray((err, docs)=>{
            if(err)
                res.status(400).json(err) //bad request
            else    
                res.status(200).json(docs)
        })
    }catch(err){
        res.status(500).json({"error": err.message})
    }
})

// DELETE /api/prestadores/:id
// Apaga o prestador
router.delete('/:id', async(req, res)=>{
    await db.collection(nomeCollection)
    .deleteOne({"_id": {$eq: ObjectId(req.params.id)}})
    .then(result => res.status(200).send(result))
    .catch(err => res.status(400).json(err))
})

// DELETE /api/prestadores/:id
// Apaga o prestador
router.post('/', validaPrestador, async(req, res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json(({
            errors: errors.array()
        }))
    }else{
        await db.collection(nomeCollection)
        .insertOne(req.body)
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).json(err))

    }

})


export default router
