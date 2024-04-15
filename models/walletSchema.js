const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    balance: {
        type: Number,
        default: 0,
        min: 0,
    },
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    }]
});

// Define schema for Transaction
const transactionSchema = new mongoose.Schema({
    walletId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet', 
        required: true
    },
    amount: {
        type: Number,
        required: true,

    },
    type: {
        type: String,
        enum: ['credit', 'debit'],
    },
    description: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Wallet = mongoose.model('Wallet', walletSchema);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = { Wallet, Transaction };
