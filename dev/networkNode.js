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
/*app.post('/transaction', function(req, res) {
    //console.log(req.body);
    // create a new transaction in the blockchain.
    // note the newly created transactions are added to the next block.
    const blockIndex = bitcoin.createNewTransaction(req.body.amount,
        req.body.sender, 
        req.body.recipient);
    res.json({note: `Transaction will be added in  block ${blockIndex}.`});
});*/

// Post transaction.
// new impl.
app.post('/transaction', function(req, res) {
    // get as is from the body.
    const newTransaction = req.body;
    
    // get block index for the addition.
    const blockIndex = bitcoin.addTransactionToPendingTransaction(newTransaction);

    res.json({note: `Transaction will be added in Block: ${blockIndex}`});
});

// 2-ops: create new transaction, broadcast to all other nodes in n/w.
app.post('/transaction/broadcast', function(req, res) {
    // create new transaction.
    const newTransaction = bitcoin.createNewTransaction(
                                            req.body.amount, 
                                            req.body.sender, 
                                            req.body.recepient);
    
    // add this new to the pending transactions.
    bitcoin.addTransactionToPendingTransaction(newTransaction);

    // create array of promises.
    const requestPromises = [];

    // Send new transaction to each node in the n/w.
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/transaction',
            method: 'POST',
            body: newTransaction,
            json: true
        };

        requestPromises.push(rp(requestOptions));

    });
    Promise.all(requestPromises)
    .then(data => {
        // all requests are completed.
        res.json({note: 'Transaction created and broadcasted successfully !!'});
    });
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
    // Need to broadcase the mining transaction as well.
    
    // finally ceate the block.
    const newBlock = bitcoin.createNewBlock(nonce, prevBlockHash, blockHash);

    const requestPromises = [];

    // Broadcast this new mined block in the n/w.
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/receive-new-block',
            method: 'POST',
            body: {newBlock: newBlock},// old way
            //body: {newBlock},
            json: true
        };

        requestPromises.push(rp(requestOptions));
    });

    // All broadcast is completed.
    Promise.all(requestPromises)
    .then(data => {
        // Need to broadcase the mining transaction as well.
        const requestOptions ={
            uri: bitcoin.currentNodeUrl + '/transaction/broadcast',
            method: 'POST',
            body: {
                amount: 12.5,
                sender: "00",
                recepient: nodeAddress
            },
            json: true
        };

        return rp(requestOptions);

    })
    .then(data => {
        res.json({
        note: "New Block Mined and Broadcasted successfully",
        block: newBlock
        });
    });
});

// Receive new block.
app.post('/receive-new-block', function(req, res) {
    const newBlock = req.body.newBlock;

    // Check if prev block hash in new block is equal to last block in chain.
    const lastBlock = bitcoin.getLastBlock();
    //const correctHash = lastBlock.hash === newBlock.previousBlockHash;
    const correctHash = lastBlock.hash === newBlock.prevBlockHash;

    // Check if new block has the correct index. ie: new block should be one
    // index above the last block in chain.
    const correctIndex = lastBlock['index'] + 1 === newBlock['index'];
    
    // Take 2-actions:
    // If new block is legitimate, add it to the blockchain.
    // else reject it .
    if(correctHash && correctIndex) {
        // add to chain
        bitcoin.chain.push(newBlock);

        // and clear pending transactions.
        bitcoin.pendingTransactions = [];
        // send res : Accepted block and added to chain.
        res.json({
            note: 'New Block received and accepted in chain.',
            //newBlock
            newBlock: newBlock //old way
        });
    } else {
        // is invalid.
        res.json({
            note: 'New Block rejected !!',
            //newBlock
            newBlock: newBlock // old way.
        });
    }
});

// Register a node and broadcast this to the entire n/w.
app.post('/register-and-broadcast-node', function(req, res) {
    const newNodeUrl = req.body.newNodeUrl;

    // If the newbodeurl is not registered, then only add.
    if(bitcoin.networkNodes.indexOf(newNodeUrl) == -1){
        // Alternate to push !!
        bitcoin.networkNodes = bitcoin.networkNodes.concat([newNodeUrl]);
        //user.tokens = user.tokens.concat([{access, token}]);
        //user.tokens.push({access, token});
            
        //bitcoin.networkNodes.push(newNodeUrl);
    }
        
    const regNodesPromises = [];
    // Broadcast this to the n/w.
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        // perform register-node.
        const requestOptions = {
            uri: networkNodeUrl + '/register-node',
            method: 'POST',
            body: { newNodeUrl: newNodeUrl},
            //body: {newNodeUrl}, // new way.
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

// Consensus on the network.
app.get('/consensus', function(req, res)  {
    const requestPromises = [];

    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions =  {
            uri: networkNodeUrl + '/blockchain',
            method: 'GET',
            json: true
        };
        requestPromises.push(rp(requestOptions));
    });
    Promise.all(requestPromises)
    .then(blockchains => {
        //data that we receive after all promises are done...
        // basically blockchains
        const currentChainLength = bitcoin.chain.length;
        let maxChainLength = currentChainLength;
        let newLongestChain = null;
        let newPendingTransactions = null;

        // Check if there is any longer blockchain in the n/w than
        // the copy of the blockchain hosted on current node.
        blockchains.forEach(blockchain => {
            if(blockchain.chain.length > maxChainLength) {
                maxChainLength = blockchain.chain.length;
                newLongestChain = blockchain.chain;

                // also replace pending transactions on the blockchain.
                newPendingTransactions = blockchain.pendingTransactions;
            };
        });

        // Do not replace the chain if there is no longest chain in n/w or
        // there exists one but is not valid.
        if(!newLongestChain || 
            (newLongestChain && !bitcoin.chainIsValid(newLongestChain))) {
                res.json({
                    note: 'Current Chain not been replaced !',
                    chain: bitcoin.chain
                });
        } else {
            // replace blockchain hosted on current node with the longest
            // chain in n/w.
            bitcoin.chain = newLongestChain;
            bitcoin.pendingTransactions = newPendingTransactions;
            res.json({
                note: 'This chain has been replaced.',
                chain: bitcoin.chain
            });
        }
    });
});

// listen to port 3000 for single node operation only.
// To run it over multiple nodes, we need this value of
// port to be different for each node. 
// So, it should come from some env.

app.listen(port, function() {
    console.log(`My Blockchain app started at port: ${port}`);
});
