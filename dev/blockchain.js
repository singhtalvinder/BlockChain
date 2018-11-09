const sha256 = require('sha256');
const uuid = require('uuid/v1');
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
Blockchain.prototype.createNewBlock = function(nonce, prevBlockHash, hash) {
    const newBlock = {
        // each block inside the blockchain.
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce: nonce, // comes from proof of work in general.
        hash: hash, // Of current block. Basically a compressed string of various transactions.
        prevBlockHash: prevBlockHash
    };

    // Clear out all for this block.
    this.pendingTransactions = []; 
    
    // push newly created block to the chain.
    this.chain.push(newBlock); 

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
        recepient: recepient,
        transactionId: uuid().split('-').join('')
    };

    return newTransaction;

    // push trasaction to the array of transactions.
    //this.pendingTransactions.push(newTransaction);

    // no of block this new is added to.
    //return this.getLastBlock()['index'] + 1;
}

// Add a new transaction to the pending transactions.
Blockchain.prototype.addTransactionToPendingTransaction = function(transactionObj) {
    this.pendingTransactions.push(transactionObj);
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

// Check if the blockchain is valid or not.
Blockchain.prototype.chainIsValid = function(blockchain) {
    let validChain = true;

    // Iterate through all of the blocks in the blockchain
    // and make sure all of the hashs line up correctly.
    for(var i = 1; i < blockchain.length; i++) {
        const currentBlock = blockchain[i];
        const prevBlock = blockchain[i-1];

        // current block hash.
        const blockHash = this.hashBlock(
            prevBlock['hash'], 
            {transactions: currentBlock['transactions'], index: currentBlock['index']},
            currentBlock['nonce']);

        // Validate every block has correct data.
        // rehash the current block (with leading 0000's).
        if(blockHash.substring(0,4) !== '0000')
            validChain = false;

        // Chain is invalid if current block hash does not match 
        // previous block hash.
        if(currentBlock['prevBlockHash'] !== prevBlock['hash']){
            validChain = false;
        }
        
        // Output the block hashes to see the diference.
        console.log('prevBlockHash=>', prevBlock['hash']);
        console.log('currentBlockHash=>', currentBlock['hash']);
    };

    // Check genesis block
    // Should match the data as specified in constructor fn:
    // Like:this.createNewBlock(100,'0','0'); // Only once.
    const genesisBlock = blockchain[0];
    const correctNonce  = genesisBlock['nonce'] === 100;
    const correctPrevBlockHash = genesisBlock['prevBlockHash'] === '0';
    const correctHash = genesisBlock['hash'] === '0';
    const correctTransactions = genesisBlock['transactions'].length === 0;

    // if there is some invalid data, then set it to false.
    if(!correctNonce || !correctPrevBlockHash ||
        !correctHash || !correctTransactions) {
        validChain = false;
    }

    return validChain;
};

// Get Block corresponding to the given hash.
Blockchain.prototype.getBlock = function(blockHash) {
    let correctBlock = null;
    this.chain.forEach(block => {
        if(block.hash === blockHash) {
            correctBlock = block;
        }
    });

    return correctBlock;
};

// Get transaction corresponding to a given transaction id.
Blockchain.prototype.getTransaction = function(transactionId) {
    let correctTransaction = null;
    let correctBlock = null;

    this.chain.forEach(block => {
        block.transactions.forEach(transaction => {
            if(transaction.transactionId === transactionId) {
                correctTransaction = transaction;
                correctBlock = block;
            };
        });
    });
    return {
        transaction: correctTransaction,
        block: correctBlock
    };
};

// Get Address balance for a given address.
Blockchain.prototype.getAddressData = function(address) {
    const addressTransactions = [];
    this.chain.forEach(block => {
        block.transactions.forEach(transaction => {
            if(transaction.sender === address || transaction.recepient === address){
                addressTransactions.push(transaction);
            };
        });
    });

    // cycle through the array to get Balance.
    let balance = 0;
    addressTransactions.forEach(transaction =>{
        if (transaction.recepient === address) {
            balance += transaction.amount;
        } else if(transaction.sender === address) {
            balance -= transaction.amount;
        }
    });
    return {
        addressTransactions: addressTransactions,
        addressBalance: balance
    };
};

// Export constructor function, to acess in other .js files.
module.exports = Blockchain;

