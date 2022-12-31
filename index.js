const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


const app = express();

// middelware
app.use(cors());
app.use(express.json());

// connect database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.scas7gd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log('database connected')

async function run(){
    try{
        client.connect();
        const productCollection = client.db('motoWorld').collection('product')

        // Create new product form the client side
        app.post('/newProduct', async(req, res)=>{
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        });

        // Find all products form db
        app.get('/product', async(req, res)=>{
        const query = {};
        const cursor = productCollection.find( query);
        const products = await cursor.toArray();
        res.send(products)
        })

        // Find my Items with email
        app.get('/myItems', async(req, res)=>{
            const email =  req.query.email;
            const query = {supplierEmail: email}
            const cursor = productCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })

        // Inventory details page / Find a single product 
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const product = await productCollection.findOne(query);
            res.send(product);
        })

        // Update a product / deliverd
        app.put('/update/:id', async( req, res)=>{
            const id = req.params.id;
            const newData = req.body;
            const filter = {_id : ObjectId(id)}
            const options = { upsert: true };
            const updateData = { $set: newData}
            const result = await productCollection.updateOne(filter, updateData, options);
            res.send(result)
            console.log(newData);

        // Delete a product
        app.delete('/product/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productCollection.deleteOne(query);
            res.send(result);

        })
        })

    }
    finally{

    }
}
run().catch(console.dir);




app.get('/', (req, res)=>{
    res.send('Moto World Server is running')
})

app.listen(port, ()=>{
    console.log('Listening to port', port);
})