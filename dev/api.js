const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid/v1');


// Import blockchain
const Blockchain = require('./blockchain');
var app = express();

 // Generate unique random string(id).
// We don't need -- in the address returned 
//and remove those.
const nodeAddress = uuid().split('-').join('');


// Create blockchain.
const bitcoin = new Blockchain();

// Allow the json data or form data, we should be able to
// access data through body parser.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Get Blockchain.
app.get('/blockchain', function(req, res) {
    res.send(bitcoin);
});

// Post transaction.
app.post('/transaction', function(req, res) {
    //console.log(req.body);
    // create a new transaction in the blockchain.
    // note the newly created transactions are added to the next block.
    const blockIndex = bitcoin.createNewTransaction(req.body.amount,
        req.body.sender, 
        req.body.recipient);
    res.json({note: `Transaction will be added in  block ${blockIndex}.`});
});

// Mine blockchain. ie Create new block.
app.get('/mine', function(req, res) {
    // get prev block
    const lastBlock = bitcoin.getLastBlock();

    // get last block's hash.
    const prevBlockHash = lastBlock['hash'];

    // get current block data.
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index'] +1
    };

    // get the nonce. To get this we need proofofWork!! 
    const nonce = bitcoin.proofOfWork(prevBlockHash, currentBlockData);

    // get hash for this new block.
    const blockHash = bitcoin.hashBlock(prevBlockHash, currentBlockData, nonce);

    // everytime someone mines the block, gets rewarded with bitcoins
    // for their effort.
    // as of current knowledge, 12.5 bitcoin is the reward.
    // a "00" for sender => a Mining reward transaction. 
    // SO, if we look at transactions in the blockchain, these kind of
    // transactions tells us that these are rewards.
    // recipient is the api is treated as a node in the bitcoin n/w.
    // later on we'll have different apis so we'll modify this part of
    // code, as blockchain is decentralized. So we will create more
    // decentralized nodes.
    // Now, we need a new node address for this node to be send the bitcoin to.
    bitcoin.createNewTransaction(12.5, "00", nodeAddress);

    // finally ceate the block.
    const newBlock = bitcoin.createNewBlock(nonce, prevBlockHash, blockHash);

    // send response back to creater.
    res.json({
        note: "New Block mined successfully",
        block: newBlock
    });
        
});

// listen to port 3000.
app.listen(3000, function() {
    console.log('My Blockchain app started at port 3000');
});
