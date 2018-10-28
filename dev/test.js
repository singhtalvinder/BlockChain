const Blockchain = require('./blockchain'); // extension .js not needed as file name is same.


const bitcoin = new Blockchain();


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

console.log(bitcoin.proofOfWork(previousBlockHash, currentBlockData));

// Hash the block.
//const nonce = 100;
//console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData,nonce));

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