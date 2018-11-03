const sha256 = require('sha256');
// using the 4-th parameter from the package.json file 
// under "Node_XX" parameters.
const currentNodeUrl = process.argv[3];
// Next update: Lets add a genesis block. The first block
// in blockchain.
// Should happen as soon as it creates blockchain.


// Can also be done in class. Ideally classes are sugar coating
//  over constructor functions.
// Create constructor funtion to build a Blockchain
function Blockchain() {
    this.chain = []; //store mined blocks.
    this.pendingTransactions = []; // store new blocks before mining.ie pending transcs.
    //This is first so we don't have any parameters. so pass arbitrary params.
    this.currentNodeUrl = currentNodeUrl;

    // Each Blockchain to be aware of all other nodes in the blockchain n/w.
    this.networkNodes = [];
    this.createNewBlock(100,'0','0'); // Only once.
}

// create new block.
Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
    const newBlock = {
        // each block inside the blockchain.
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce: nonce, // comes from proof of work in general.
        hash: hash, // Of current block. Basically a compressed string of various transactions.
        previousblockHash: previousBlockHash
    };
    this.pendingTransactions = []; // clear out all for this block.
    this.chain.push(newBlock); // push newly created block to the chain.

    return newBlock;
}

// Return last block in blockchain.
Blockchain.prototype.getLastBlock = function() {
    return this.chain[this.chain.length -1];
}

// Create new transaction.
Blockchain.prototype.createNewTransaction = function(amount, sender, recepient) {
    // create trans obj.
    const newTransaction = {
        amount: amount,
        sender: sender,
        recepient: recepient
    };

    // push trasaction to the array of transactions.
    this.pendingTransactions.push(newTransaction);

    // no of block this new is added to.
    return this.getLastBlock()['index'] + 1;
}

// Generate Hash using sha256.
Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
    // previousBlockHash is a string, nonce is an interger, currentBlockData is/can be object.
    // so convert all into a single usable string for generating hash.

    const dataAsString  = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData)

    // Create hash. A pretty random hash.
    const hash = sha256(dataAsString);
    return hash;
}

// Proof of Work!! 
// Generate hash- starting with 0000 in the begining so that hashing is not that
// random and takes some time to generate.
// ie
// Repeatedly hash block until it finds correct hash - stats with 0000.
// Uses current Block data for the hash with the previousblockHash
// continue to change nonce value until it finds the correct hash as 
// mentioned above.
// return the nonce value that creates the correct hash.
Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);

    // Keep hashing till  we get 0000 at the start.
    // increment nonce each time.
    while(hash.substring(0,4) != '0000') {
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
        // Testing only:log each hash and only the last one will be with 0000. 
        //console.log(hash+ '\n');

    }

    // return nonce value that was used to generate hash 
    // with 0000 at start and This is the proof.
    return nonce; 
}

// Export constructor function, to acess in other .js files.
module.exports = Blockchain;

