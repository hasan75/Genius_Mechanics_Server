const express = require ('express');
const app = express();
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000;


app.get('/',(req,res)=> {
    res.send('Running Genius Server');
});
app.listen(port, ()=> {
    console.log('Running Genius Server on PORT', port);
});