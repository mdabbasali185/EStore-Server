const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');


// declare port and app
const port = process.env.PORT || 5000
const app = express()


// middleware 
app.use(cors())
app.use(express.json())

const jwtVerify = (req, res, next) => {
    const token = req.headers.authorization

    jwt.verify(token, process.env.TOKEN_SECRETE, function (err, decoded) {
        if (err) {
            console.dir(err)   //send error message
            return
        }
        req.decoded = decoded
        next()
    });

}














const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@todo.yuvqo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        console.log('data base connected');
        const collection = client.db("inventory").collection("products");

        app.get('/inventories', async (req, res) => {
            const { limit } = req.query


            const query = {}
            const cursor = collection.find(query)
            const result = await cursor.limit(parseInt(limit)).toArray()
            res.status(200).send(result)
        })

        // post inventory
        app.post('/inventories', async (req, res) => {

            const { image, name, price, quantity, supplier, description, email } = req.body
            const newInventory = { image, name, price, quantity, supplier, description, email }
            const insert = await collection.insertOne(newInventory)
            if (insert) {
                res.status(200).send(insert)
            }




        })
        // get 1
        app.get(`/inventory/:id`, async (req, res) => {
            const { id } = req.params
            const filter = { _id: ObjectId(id) }
            const result = await collection.findOne(filter)
            res.send(result)
        })

        // my items
        app.get(`/my-items`, jwtVerify, async (req, res) => {
            const email = req.decoded.email

            const filter = { email }
            const cursor = collection.find(filter)
            const result = await cursor.toArray()
            res.send(result)
        })

        // delete
        app.delete(`/inventory/:id`, async (req, res) => {
            const { id } = req.params
            const filter = { _id: ObjectId(id) }
            const itemDelete = await collection.deleteOne(filter)
            res.send(itemDelete)
        })

        // jwt token
        app.post('/jwt-generator', async (req, res) => {
            const email = req.body.email
            const token = jwt.sign({ email }, process.env.TOKEN_SECRETE);
            res.send(token)
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