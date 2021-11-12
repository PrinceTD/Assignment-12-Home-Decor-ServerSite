const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId =require('mongodb').ObjectId
require('dotenv').config()
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ha5cn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("load_products")
        const productCollection = database.collection('product');

        // GET Product
        app.get('/product', async (req, res) => {
            const cursor = productCollection.find({});
            const product = await cursor.toArray();
            res.send(product)
        });

        // Get single service
        app.get("/product/:id", async(req, res)=>{
            const id = req.params.id;
            console.log("hitting  service id", id);
            const query ={_id: ObjectId(id)};
            const product = await productCollection.findOne(query)
            res.json(product);
        })

        // // post api
        // app.post("/product", async (req, res) => {
        //     const product = req.body;
        //     console.log("hit the post", product);

        //     const result = await travelCollection.insertOne(product);
        //     console.log(result);

        //     res.json(result)
        // })


    }
    finally {
        // await client close()
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listing :${port}`)
})