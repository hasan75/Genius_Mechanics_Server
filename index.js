const express = require ('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors')
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4dxux.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//to test the user and password
//console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){
    try{
        await client.connect();
        console.log('connected to database');

        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");
        //GET API
        app.get('/services', async(req,res)=>{
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray();
            res.send(services);
        })

        //GET Single Service
        app.get('/services/:id', async(req,res)=>{
            const id = req.params.id;
            console.log('getting service', id);
            const query = {_id: ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        //for Update Operation
        app.get('/services/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await servicesCollection.findOne(query)
            console.log('Load user with Id', id)
            res.send(service);
        })

        //POST API
        app.post('/services', async(req,res) => {
            const service = req.body;
            console.log('Hit the POST API', service);

            const result = await servicesCollection.insertOne(service)
            console.log(result)
            res.json(result);
        })

        //PUT API
        app.put('/services/:id', async(req,res)=>{
            const id = req.params.id;
            const updatedService = req.body;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updateDoc = {
                $set:{
                    name:updatedService.name,
                    price: updatedService.price,
                    img: updatedService.img,
                    description: updatedService.description
                },
            };
            const result = await servicesCollection.updateOne(filter, updateDoc, options)
            console.log('Updating Product', id);
            res.json(result)
        })

        //DELETE API
        app.delete('/services/:id', async(req,res)=> {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await servicesCollection.deleteOne(query);
            res.json(result)
        })
        

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/',(req,res)=> {
    res.send('Running Genius Server');
});
app.listen(port, ()=> {
    console.log('Running Genius Server on PORT', port);
});