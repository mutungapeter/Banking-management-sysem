const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    type: { type: String, enum: ['deposit', 'withdrawal', 'transfer_in', 'transfer_out', 'initial_deposit', 'interest_earned'], required: true },
    amount: { type: Number, required: true },
    interestRate: { type: Number, required: false },
    termYears: { type: Number, required: false },
    date: { type: Date, default: Date.now },
    description: { type: String, required: false },
    recipientAccountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: false },
    senderAccountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: false }
});

const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction;
