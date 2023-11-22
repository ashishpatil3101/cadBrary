if( process.env.NODE_ENV !== 'production' ) require('dotenv').config();


const express = require('express');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const indexRouter = require('./routs/index')

app.set('view engine', 'ejs') //which view engine we r using
app.set('views' , __dirname + '/views'); // where the views coming from
app.set('layout', 'layouts/layout') //tells where layout file are
app.use( expressLayouts );
app.use( express.static('public'))


mongoose.connect( process.env.DATABASE_URL)

const db = mongoose.connection;   //provides mongoDB connection methods and events
db.on("error", error => console.log(error))   //when connection emmits error 
db.once("open",()=>console.log('db connected sucessfully'))   //succefully connected


app.use('/',indexRouter);


app.listen( process.env.PORT || 3000, ()=>{
     
    console.log('server is up and running')
})