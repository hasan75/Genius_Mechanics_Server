const express = require ('express');
const { MongoClient } = require('mongodb');
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

        //POST API
        app.post('/services', async(req,res) => {
            const service = req.body;
            console.log('Hit the POST API', service);

            const result = await servicesCollection.insertOne(service)
            console.log(result)
            res.json(result);
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