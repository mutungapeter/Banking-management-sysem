const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    accountNumber: { type: String, unique: true, required: true },
    accountType: { type: String, enum: ['Savings', 'Checking'], required: true },
    balance: { type: Number, default: 0 },
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
    createdAt: { type: Date, default: Date.now }
});

const Account = mongoose.model('Account', AccountSchema);
module.exports = Account;
