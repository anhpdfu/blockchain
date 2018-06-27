import {SHA256} from 'crypto-js';

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    constructor(timestamp, transactions, prevHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.prevHash = prevHash;
        this.hash = this.calcHash();
        this.nonce = 0;
    }

    calcHash() {
        return SHA256(this.index +
            this.prevHash +
            this.timestamp +
            JSON.stringify(this.data) +
            this.nonce
        ).toString();
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++;
            this.hash = this.calcHash();
        }

        console.log('Block mined: ' + this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block(0, '01/01/2018', 'Genesis block', "0");
    }

    getLastestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("Block successfully mined!");
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;

        for (const block in this.chain) {
            for (const tran in block.transactions) {
                if (tran.fromAddress === address) {
                    balance -= tran.amount;
                }

                if (tran.toAddress === address) {
                    balance += tran.amount;
                }
            }
        }

        return balance;
    }

    isValidChain() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calcHash()) {
                return false;
            }

            if (currentBlock.prevHash !== prevBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let bc = new Blockchain();
// bc.difficulty = 4;

// console.log('Mining block 1...');
// bc.addBlock(new Block(1, '02/01/2018', {amount: 4}));

// console.log('Mining block 2...');
// bc.addBlock(new Block(2, '04/01/2018', {amount: 34}));

// console.log('is valid blockchain?', bc.isValidChain());

bc.createTransaction(new Transaction('addrres1', 'address2', 100));
bc.createTransaction(new Transaction('addrres2', 'address1', 50));

console.log('\nStarting the miner...');
bc.minePendingTransactions('xaviers-address');

console.log('\nBalance of xavier is', bc.getBalanceOfAddress('xaviers-address'));

console.log('\nStarting the miner again...');
bc.minePendingTransactions('xaviers-address');

console.log('\nBalance of xavier is', bc.getBalanceOfAddress('xaviers-address'));

console.log(JSON.stringify(bc, null, 2));

