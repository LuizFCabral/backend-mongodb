//API REST dos prestadores
import exepress from 'express'
import {connectToDatabase} from '../utils/mongodb.js'

const router =  exepress.Router()
const {db, ObjectId} = await connectToDatabase()
const nomeCollection = 'prestadores'

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



export default router
