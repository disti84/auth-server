const express = require('express'),  
    path = require('path'),  
    bodyParser = require('body-parser'),  
    cors = require('cors'),  
    mongoose = require('mongoose'),  
    dotenv = require('dotenv'),
    config = require('./DB');  
   const authRoute = require('./routes/auth.route');  
   const socialRoute = require('./routes/social.route'); 
   let authorization = require('./models/authorization');

   mongoose.Promise = global.Promise;
   mongoose.connect(config.DB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(
     () => { console.log('Database is connected') },
     err => { console.log('Can not connect to the database' + err) }
   ); 
    const app = express();  
    app.use(bodyParser.json());  
    app.use(cors());  
    app.use('/auth', authRoute);  
    app.use('/social', socialRoute);
    const port = process.env.PORT || 4500;  
    const server = app.listen(port, function(){  
     console.log('Listening on port ' + port);  
    });  
