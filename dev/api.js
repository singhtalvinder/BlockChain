const express = require('express');
const bodyParser = require('body-parser');
var app = express();


// Allow the json data or form data, we should be able to
// access data through bosy parser.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Get Blockchain.
app.get('/blockchain', function(req, res) {
    
});

// Post transaction.
app.post('/transaction', function(req, res) {
    console.log(req.body);
    res.send(`The amount of Transaction is ${req.body.amount} bitcoin`);
});

// Mine blockchain.
app.get('/mine', function(req, res) {
    
});

// listen to port 3000.
app.listen(3000, function() {
    console.log('My Blockchain app started at port 3000');
});
