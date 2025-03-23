const express = require('express');
const Account = require('../models/accounts');
const Transaction = require('../models/transactions');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();


router.get('/transactions', authMiddleware, async (req, res) => {
  try {
// console.log("user", req.user)
    const userAccounts = await Account.find({ userId: req.userId });
    // console.log("userAccounts", userAccounts);
    
    const accountIds = userAccounts.map(account => account._id);
    // console.log("accountIds", accountIds);
    const transactions = await Transaction.find({
      $or: [
        { accountId: { $in: accountIds } },
        { recipientAccountId: { $in: accountIds } }
      ]
    })
    .populate('accountId', 'accountNumber accountType date type amount')
    .populate('recipientAccountId', 'accountNumber accountType date type amount')
    .sort({ date: -1 }); 
    
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
  }
});

// GET transactions for a specific account
router.get('/account/:accountId', authMiddleware, async (req, res) => {
  try {
    const { accountId } = req.params;
    
    // Verify the account belongs to the authenticated user
    const account = await Account.findOne({ 
      _id: accountId,
      userId: req.user.id
    });
    
    if (!account) {
      return res.status(403).json({ message: 'You do not have access to this account' });
    }
    
    // Find transactions where this account is involved (either as source or recipient)
    const transactions = await Transaction.find({
      $or: [
        { accountId: accountId },
        { recipientAccountId: accountId }
      ]
    })
    .populate('accountId', 'accountNumber name balance')
    .populate('recipientAccountId', 'accountNumber name balance')
    .sort({ date: -1 });
    
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching account transactions:', error);
    res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
  }
});

module.exports = router;



