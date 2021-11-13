const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
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
        const userCollection = database.collection('users')

        // GET Product
        app.get('/product', async (req, res) => {
            const cursor = productCollection.find({});
            const product = await cursor.toArray();
            res.json(product)
        });


        // Get single service
        app.get("/product/:id", async (req, res) => {
            const id = req.params.id;
            console.log("hitting id", id);
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query)
            res.json(product);
        });


        app.post('/users', async(req, res)=>{
            const user = req.body;
            const result = await userCollection.insertOne(user)
            console.log(result);
            res.json(result);
        })
        


       


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