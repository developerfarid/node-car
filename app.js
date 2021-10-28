
// nane  car
// pass 23P6hik4cMKqMObm


const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
const cors = require('cors')//cors for own server connected with own
require("dotenv").config();//dotenv config
const port = 5000
const ObjectId = require("mongodb").ObjectId

//Middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://car:23P6hik4cMKqMObm@cluster0.doqsn.mongodb.net/car?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        const database = client.db("car-services")
        const serviceCollection = database.collection("services")

        // post api
      app.get("/services", async (req, res) => {
        const cours = serviceCollection.find({})
        const services = await cours.toArray()
        res.send(services)
        })
        app.post('/services', async (req, res) => {
          console.log("hit");
          const service = req.body
        
          const result = await serviceCollection.insertOne(service)
          console.log(result);
            res.json(result)
          
        })
      app.get('/services/:id', async (req, res) => {
        const id = req.params.id
        const quary = { _id: ObjectId(id) }
        const result = await serviceCollection.findOne(quary)
        res.send(result)


      })
      app.delete('/services/:id', async (req, res) => {
        const id = req.params.id
        const quary = { _id: ObjectId(id) }
        const result = await serviceCollection.deleteOne(quary)
        res.json(result)
      } )

    }
    finally {
      // await client.close()
    }
}
run().catch(console.dir)



app.get('/', (req, res) => {
  res.send('Hello dfdcWorld!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})