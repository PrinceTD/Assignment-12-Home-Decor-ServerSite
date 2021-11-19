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
        const reviews = database.collection("review");
        const orders = database.collection("all_orders");

        // GET Product
        app.get('/product', async (req, res) => {
            const cursor = productCollection.find({});
            const product = await cursor.toArray();
            res.json(product)
        });

        app.post("/product", async (req, res) => {
            const product = req.body;
            console.log(product);
            const result = await productCollection.insertOne(product);

            res.send(result);
        });
        app.delete("/product/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.deleteOne(query);
            res.json(product);
        });


        // Get single service
        app.get("/product/:id", async (req, res) => {
            const id = req.params.id;
            console.log("hitting id", id);
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query)
            res.json(product);
        });

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const quary = { email: email };
            const user = await userCollection.findOne(quary);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });

        })
        app.post("/orders", async (req, res) => {
            const order = req.body;
            const result = await orders.insertOne(order);
            res.send(result);
        });
        app.get("/orders", async (req, res) => {
            const allOrders = orders.find({});
            const result = await allOrders.toArray();
            res.json(result);
        });
        app.get("/orders/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const allOrders = orders.find(query);
            const result = await allOrders.toArray();
            res.json(result);
        });
        app.delete("/orders/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = orders.deleteOne(query);
            res.json(result);
        });


        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user)
            console.log(result);
            res.json(result);
        })
        app.put('/users', async (req, res) => {
            const user = req.body;

            const filter = { email: user.email };
            const options = { upsert: true }
            const updateDoc = { $set: user };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        app.get("/review", async (req, res) => {
            const allReviews = reviews.find({});
            const result = await allReviews.toArray();
            res.json(result);
        });
        app.post("/review", async (req, res) => {
            const order = req.body;
            const result = await reviews.insertOne(order);
            res.send(result);
        });


        app.put('/users/admin', async (req, res) => {
            const user = req.body;

            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await userCollection.updateOne(filter, updateDoc)
            res.json(result)
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