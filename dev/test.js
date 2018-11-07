const Blockchain = require('./blockchain'); // extension .js not needed as file name is same.

// Instance of our blockchain.
const bitcoin = new Blockchain();

// To Test a valid blockchain, 
// Create a blockchain, I did only on one node.
// Then add some transactions and mine some blocks.
// Then copy the blockchain from there and pass this
// blockchain to the method to validate.
// Also. manipulate data to see how the method behaves.

const bc1 = 
{
    chain: [
    {
    index: 1,
    timestamp: 1541612500624,
    transactions: [ ],
    nonce: 100, 
    hash: "0",
    prevBlockHash: "0"
    },
    {
    index: 2,
    timestamp: 1541612523731,
    transactions: [ ],
    nonce: 18140,
    hash: "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
    prevBlockHash: "0"
    },
    {
    index: 3,
    timestamp: 1541612588701,
    transactions: [
    {
    amount: 12.5,
    sender: "00",
    recepient: "62509900e2b411e8b0f71d7e3a69c07c",
    transactionId: "701adf00e2b411e8b0f71d7e3a69c07c"
    },
    {
    amount: 10,
    sender: "3001ORT40954590NVMNCMVN65675",
    recepient: "2547DFJIFJ9347JJFDJ8334325",
    transactionId: "86acc3a0e2b411e8b0f71d7e3a69c07c"
    },
    {
    amount: 20,
    sender: "3001ORT40954590NVMNCMVN65675",
    recepient: "2547DFJIFJ9347JJFDJ8334545",
    transactionId: "8bcfeb50e2b411e8b0f71d7e3a69c07c"
    },
    {
    amount: 30,
    sender: "3001ORT40954590NVMNCMVN65675",
    recepient: "2547DFJIFJ9347JJFDJ8334548",
    transactionId: "913265f0e2b411e8b0f71d7e3a69c07c"
    }
    ],
    nonce: 88009,
    hash: "0000b058468ec5150643ba2c0e674a66715e86e5101a7aaefa85cc90b4e3bcbd",
    prevBlockHash: "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
    },
    {
    index: 4,
    timestamp: 1541612627920,
    transactions: [
    {
    amount: 12.5,
    sender: "00",
    recepient: "62509900e2b411e8b0f71d7e3a69c07c",
    transactionId: "96d08a00e2b411e8b0f71d7e3a69c07c"
    },
    {
    amount: 40,
    sender: "3001ORT40954590NVMNCMVN65675",
    recepient: "2547DFJIFJ9347JJFDJ8334548",
    transactionId: "a3516010e2b411e8b0f71d7e3a69c07c"
    },
    {
    amount: 50,
    sender: "3001ORT40954590NVMNCMVN65675",
    recepient: "2547DFJIFJ9347JJFDJ8334548",
    transactionId: "a5f72bb0e2b411e8b0f71d7e3a69c07c"
    },
    {
    amount: 60,
    sender: "3001ORT40954590NVMNCMVN65675",
    recepient: "2547DFJIFJ9347JJFDJ8334548",
    transactionId: "a8cb3340e2b411e8b0f71d7e3a69c07c"
    },
    {
    amount: 70,
    sender: "3001ORT40954590NVMNCMVN65675",
    recepient: "2547DFJIFJ9347JJFDJ8334548",
    transactionId: "ab4cae00e2b411e8b0f71d7e3a69c07c"
    }
    ],
    nonce: 38367,
    hash: "000068a305df27885b75afac5ffeb9340bda8d09d5b42d3e01a18e9f3fccbb24",
    prevBlockHash: "0000b058468ec5150643ba2c0e674a66715e86e5101a7aaefa85cc90b4e3bcbd"
    },
    {
    index: 5,
    timestamp: 1541612640763,
    transactions: [
    {
    amount: 12.5,
    sender: "00",
    recepient: "62509900e2b411e8b0f71d7e3a69c07c",
    transactionId: "ae30e230e2b411e8b0f71d7e3a69c07c"
    }
    ],
    nonce: 13943,
    hash: "0000872a6dd45da632bc84ea664f1ff41b40f7e704ef7c4e973be0a2011c9af9",
    prevBlockHash: "000068a305df27885b75afac5ffeb9340bda8d09d5b42d3e01a18e9f3fccbb24"
    },
    {
    index: 6,
    timestamp: 1541612643013,
    transactions: [
    {
    amount: 12.5,
    sender: "00",
    recepient: "62509900e2b411e8b0f71d7e3a69c07c",
    transactionId: "b5d86ad0e2b411e8b0f71d7e3a69c07c"
    }
    ],
    nonce: 324,
    hash: "00000b116bc0d2f0179312c13d3cd6b390f0e138a6b4db1cb743975bffef2b96",
    prevBlockHash: "0000872a6dd45da632bc84ea664f1ff41b40f7e704ef7c4e973be0a2011c9af9"
    }
    ],
    pendingTransactions: [
    {
    amount: 12.5,
    sender: "00",
    recepient: "62509900e2b411e8b0f71d7e3a69c07c",
    transactionId: "b72fbd70e2b411e8b0f71d7e3a69c07c"
    }
    ],
    currentNodeUrl: "http://localhost:3001",
    networkNodes: [ ]
    };



    console.log('Valid:', bitcoin.chainIsValid(bc1.chain));




























// To test the creation of genesis block.
//console.log("The Genesis block !!\n");
//console.log(bitcoin);

/*
const previousBlockHash = 'OUIOBVNYU5675CBVCVB43543';
 
// array of all the transcations present in the block.
const currentBlockData = [
    {
        amount: 10,
        sender: '58695068KLFDGFJDKLGJFDGKJF90238',
        recipient: '8989068KLFD67676567JFDGKJF0934DGFH',
    },
    {
        amount: 30,
        sender: 'LFDGFJDKLGJF58695068KDGKJF89023',
        recipient: '0934DGFH068KLFD67676567JFDGKJF8989',
    },
    {
        amount: 200,
        sender: 'GFJDKLGJFD58695068KL238FDGKJF90',
        recipient: '67676567JFDGKJF0934DG8989LFDFH068K',
    },
];
*/
//console.log(bitcoin.proofOfWork(previousBlockHash, currentBlockData));

// Hash the block.
//const nonce = 100;
// Now since we tested the proofofwork in above call. Lets use the same 
// nonce value to see if we get the same hash or not.
// On executing we found that the hash is same. 
// This ensures its working fine.
//console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData,220957));

/*
bitcoin.createNewBlock(2389, 'OI66685544320N', '903489FDFD34');

bitcoin.createNewTransaction(100, 'ALEX89RRRERGFVVER23244', 'JIN099898789SDDSDS4545');

bitcoin.createNewBlock(1134, 'OX456785544320N', 'OW90387897DFD9');
//bitcoin.createNewBlock(2899, 'OI6321544320N', '90348DGFS');


bitcoin.createNewTransaction(50, 'ALEX89RRRERGFVVER23244', 'JIN099898789SDDSDS4545');
bitcoin.createNewTransaction(2000, 'ALEX89RRRERGFVVER23244', 'JIN099898789SDDSDS4545');
bitcoin.createNewTransaction(300, 'ALEX89RRRERGFVVER23244', 'JIN099898789SDDSDS4545');
// the above 3 transaction will be in pending transactios, since we didn't 
//created a new block to add theseto .

// create / mine new block;
bitcoin.createNewBlock(23142, 'OXY485544320N', 'OUY387897565DFD9');


console.log(bitcoin);
console.log(' =======================');
console.log(bitcoin.chain[2]);
*/