import express, {json} from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import joi from "joi";

dotenv.config()

const mongoClient = new MongoClient(process.env.MONGODB_URL);
let db;
db = mongoClient.connect().then( () => {
    db = mongoClient.db("bate-papo-uol")
})

const server = express();
server.use(cors());
server.use(json());

// formato participante: {name: 'João', lastStatus: 12313123}
// formato mensagem: {from: 'João', to: 'Todos', text: 'oi galera', type: 'message', time: '20:04:37'}

server.post("/participants", async (req, res) => {

    const userData = req.body
    const userDataSchema = joi.object(
        {
          name: joi.string().required()
        }
      );
    const isBodyValid = userDataSchema.validate(userData, { abortEarly: false })


    if (isBodyValid.error) {
        return res.sendStatus(422);
    }

    try{
        const isRegistered = await db.collection("participants").findOne(userData)
        
        if (isRegistered){
            return res.sendStatus(409);
        }

        res.sendStatus(201);
    }catch{
        res.sendStatus(500);
    }

})

server.listen(process.env.PORT, () => console.log("servidor rodando"));
