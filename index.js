require('dotenv').config();

const {PORT = 3000} = process.env;
const express = require('express');
const server = express();

const morgan = require('morgan');
server.use(morgan('dev'));

const bodyParser = require('body-parser');
server.use(bodyParser.json());

const cors = require('cors');
server.use(cors('dev'));

const apiRouter = require('./api');
server.use('/api', apiRouter);

// Create custom 404 handler that sets the status code to 404.
// Handle 404
server.use(function(req, res) {
    res.status(404);
   res.send( {error: 'Route Not Found'});
   });
   
//    // Handle 500
   server.use(function(req, res, next) {
     res.status(500);
   res.send({error:'Route Not Found'});
   });
// Create custom error handling that sets the status code to 500
// and returns the error as an object


const client = require('./db/client');

server.listen(PORT, () => {
    client.connect();
    console.log('The server is up on port', PORT)
  });
