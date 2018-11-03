// History:
// Renamed this file because from now on, I'm going to make it 
// a decentralized one. This code needs to run on multiple nodes.

const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid/v1');
const rp = require('request-promise');

// Import blockchain
const Blockchain = require('./blockchain');


var app = express();

// use third parameter from cmd line  as in package.json under
// "start" / "node_" option and servers as port number.
const port = process.argv[2];


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

// Register a node and broadcast this to the entire n/w.
app.post('/register-and-broadcast-node', function(req, res) {
    const newNodeUrl = req.body.newNodeUrl;

    // If the newbodeurl is not registered, then only add.
    if(bitcoin.networkNodes.indexOf(newNodeUrl) == -1)
        bitcoin.networkNodes.push(newNodeUrl);
        const regNodesPromises = [];
        // Broadcast this to the n/w.
        bitcoin.networkNodes.forEach(networkNodeUrl => {
        // perform register-node.
        const requestOptions = {
            uri: networkNodeUrl + '/register-node',
            method: 'POST',
            //body: { newNodeUrl: newNodeUrl},
            body: {newNodeUrl}, // new way.
            json: true
        };
        regNodesPromises.push(rp(requestOptions));
    });
    Promise.all(regNodesPromises)
    .then(data => {
        const bulkRegisterOptions = {
            uri: newNodeUrl + '/register-nodes-bulk',
            method: 'POST',
            body: {allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl]},
            json: true
        };
        return rp(bulkRegisterOptions);
        })
        .then(data => {
            res.json({note: 'New node registered successfully with the network!!'});
        });
});

// Register a new node with the n/w.
app.post('/register-node', function(req, res){
    const newNodeUrl = req.body.newNodeUrl;

    // add to existing n/w of nodes if it doesn't exist.
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
    
    // Also, don't add if it's the current node.
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
    if(nodeNotAlreadyPresent && notCurrentNode) {
        bitcoin.networkNodes.push(newNodeUrl);
    }

    res.json({note: 'New node registered succesfully !!'});
});


// Register multiple nodes in one shot.
app.post('/register-nodes-bulk', function(req, res) {
    const allNetworkNodes = req.body.allNetworkNodes;
    // loop through all node url in this arr and register with new node.
    // if its not already present and not current one.
    allNetworkNodes.forEach(networkNodeUrl => {
        const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
        const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
        if(nodeNotAlreadyPresent && notCurrentNode) {
            bitcoin.networkNodes.push(networkNodeUrl);
        }
    });

    res.json({note: 'Bulk nodes registration successfull'});
});


// listen to port 3000 for single node operation only.
// To run it over multiple nodes, we need this value of
// port to be different for each node. 
// So, it should come from some env.

app.listen(port, function() {
    console.log(`My Blockchain app started at port: ${port}`);
});
