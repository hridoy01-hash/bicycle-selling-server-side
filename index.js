const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;



//midleware
app.use(cors());
app.use(express.json());

//connected database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6rclh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//main functionality

async function run(){

    try{

        await client.connect();
        const database = client.db('bicycleStore')
        const productsCollection = database.collection('products');
        const ordersCollection = database.collection('orders');
        console.log('Database Connected Successfully');

        //GET API(products)
        app.get('/products',async(req,res)=>{
            const cursor = productsCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        });

        //GET API (find product by id)
        app.get('/products/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await productsCollection.findOne(query);
            res.json(result);

        });

        //POST API (order collecion)
        app.post('/orders',async(req,res)=>{
            const order = req.body
            const result = await ordersCollection.insertOne(order);
            console.log(result);
            res.json(result);
        });

         //FIND ORDER BY EMAIL
         app.get('/orders/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email);
            const result = await ordersCollection.find({ email : email }).toArray();
            console.log(result);
            res.json(result);
        });

         //FIND ALL ORDER 
         app.get("/orders", async (req, res) => {
            const cursor = ordersCollection.find({})
            const result = await cursor.toArray(cursor);
            res.json(result);
        });
  

    }
    finally{

        // await client.close();

    }

}
run().catch(console.dir)






//initial setup reqire
app.get('/',(req,res)=>{
    res.send('Bicycle Server Is Running')
});

app.listen(port,()=>{
   console.log('Server is Running',port);
})