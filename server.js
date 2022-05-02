const express = require('express');
const cors = require('cors');
require('dotenv').config()
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// declare port and app
const port = process.env.PORT || 5000
const app = express()


// middleware 
app.use(cors())
app.use(express.json())








const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@todo.yuvqo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const collection = client.db("inventory").collection("products");
        // pore korbo
        app.post('/login', (req, res) => {
            const email = req.body.email
            const token = jwt.sign({ email }, process.env.TOKEN_SECRETE, { expiresIn: '1h' })
            res.send({ token })
        })

        app.get('/inventories', async (req, res) => {
            const query = {}
            const cursor = collection.find(query)
            const result = await cursor.toArray()
            res.status(200).send(result)
        })

        // post inventory
        app.post('/inventories', async (req, res) => {
            console.log(req.body);
            const { image, name, price, quantity, supplier, description, email } = req.body
            const newInventory = { image, name, price, quantity, supplier, description, email }
            const insert = await collection.insertOne(newInventory)
            if (insert) {
                res.status(200).send(result)
            }

        })

        app.delete(`/inventory/:id`, async (req, res) => {
            const { id } = req.params
            const filter = { _id: ObjectId(id) }
            const itemDelete = await collection.deleteOne(filter)
            res.send(itemDelete)
        })



    } finally {

    }
}

run().catch(console.dir)


















// basic route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'server active now' })
})

// port listening
app.listen(port, () => console.log('server is online...'))