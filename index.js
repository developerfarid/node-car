const express = require("express")
const { MongoClient } = require('mongodb');
const app = express()
const cors = require("cors")
require('dotenv').config()
const port = process.env.PORT || 5000
app.get('/', (req, res) => {
  res.send("ok")
})

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.doqsn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);


async function run() {
  try {
    await client.connect()
    const database = client.db("emajon")
    const productCollection = database.collection("products")


    app.get('/products', async (req, res) => {
      const page = req.query.page
      const size = parseInt(req.query.size)
      const cursor = productCollection.find({})
      let products;
      const count = await cursor.count()
      if (page) {
        products = await cursor.skip(page*size).limit(size).toArray()
      } else {
        products = await cursor.toArray()
      }
      res.send({products, count})
    })
    app.post("/products/bykeys", async (req, res) => {
      console.log(req.body);
      const keys = req.body
      const quary = { key: { $in: keys } }
      const products=  await productCollection.find(quary).toArray()
      res.json(products)
    })

  }
  finally {
    // await client.close()
  }
}
run().catch(console.dir)


app.listen(port, () => {
  console.log("server ok ", port);
})