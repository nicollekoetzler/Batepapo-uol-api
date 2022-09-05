import express, {json} from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import joi from "joi";
import dayjs from "dayjs";

dotenv.config()

const mongoClient = new MongoClient(process.env.MONGODB_URL);
let db;
db = mongoClient.connect().then( () => {
    db = mongoClient.db("bate-papo-uol")
})

const server = express();
server.use(cors());
server.use(json());


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

        await db.collection("participants").insertOne({
            name: userData.name,
            lastStatus: Date.now()
        })

        await db.collection("messages").insertOne({
            from: userData.name,
            to: "Todos",
            text: "entra na sala...",
            type: "status",
            time: dayjs(Date.now()).format("HH:mm:ss"),
        })

        res.sendStatus(201);
    }catch{
        res.sendStatus(500);
    }

});

server.get("/participants", async (req, res) => {

    try{

        const participantsList = await db.collection("participants").find().toArray()

        res.status(200).send(participantsList);

    }catch(err){

        console.log(err)
        res.sendStatus(500)
    }
});

server.listen(process.env.PORT, () => console.log("servidor rodando"));
