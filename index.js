require("dotenv").config();
const express = require('express');
const {config} = require('nodemon');


const app = express();



const sampleRoutes = require('./routes/sampleRoutes');
const userRoutes = require('./routes/userRoutes');
const studentRoutes = require('./routes/studentRoutes')

//Samples
app.use('/samples', sampleRoutes)
//----------------------------------


//User
app.use('/api', userRoutes)
//-----------------------------------


//Students
app.use('/api', studentRoutes)
//-----------------------------------


//Home
app.use('/home', (req, res) =>{
    res.send('HomePage')
})

app.use((req, res) =>{
    res.redirect('/home')
})
//------------------------------------

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App is running on port ${port}...`));

