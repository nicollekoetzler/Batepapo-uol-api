import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

dotenv.config()

const mongoClient = new MongoClient(process.env.MONGODB_URL);
let db;
db = mongoClient.connect().then( () => {
    db = mongoClient.db("bate-papo-uol")
})

const server = express();
server.use(cors());

server.get("/teste",(req,res) => {
    res.status(200).send("deu bom");
})

server.listen(process.env.PORT, () => console.log("servidor rodando"));
