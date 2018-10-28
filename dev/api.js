const express = require('express');

var app = express();

// Starting endpoint '/'.
app.get('/', function(req, res) {
    res.send('My App for Blockchain')
});

// listen to port 3000.
app.listen(3000);
console.log('My Blockchain app started at port 3000') ;