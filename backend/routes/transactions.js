const express = require('express');
const Account = require('../models/accounts');
const Transaction = require('../models/transactions');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const employeeAuth = require('../middlewares/employeeAuth');
const User = require('../models/users');
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



// GET customer details with accounts and transactions for employees
// router.get('/customer/:id', authMiddleware, employeeAuth, async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // Verify the requesting user is an employee (you may need to adjust this based on your auth system)
//     if (req.user.role !== 'employee' && req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Unauthorized access' });
//     }
    
//     // Find the customer
//     const customer = await User.findById(id);
//     if (!customer) {
//       return res.status(404).json({ message: 'Customer not found' });
//     }
    
//     // Get customer accounts
//     const accounts = await Account.find({ userId: id });
    
//     // Get account IDs for transaction lookup
//     const accountIds = accounts.map(account => account._id);
    
//     // Get transactions for all customer accounts
//     const transactions = await Transaction.find({
//       $or: [
//         { accountId: { $in: accountIds } },
//         { recipientAccountId: { $in: accountIds } }
//       ]
//     })
//     .populate('accountId', 'accountNumber accountType')
//     .populate('recipientAccountId', 'accountNumber accountType')
//     .sort({ date: -1 });
    
//     // Format the response
//     res.status(200).json({
//       customer: {
//         id: customer._id,
//         first_name: customer.first_name,
//         last_name: customer.last_name,
//         email: customer.email,
//         phone: customer.phone,
//       },
//       accounts: accounts.map(account => ({
//         id: account._id,
//         accountNumber: account.accountNumber,
//         accountType: account.accountType,
//         balance: account.balance,
//         createdAt: account.createdAt
//       })),
//       transactions: transactions
//     });
    
//   } catch (error) {
//     console.error('Error fetching customer details:', error);
//     res.status(500).json({ message: 'Failed to fetch customer details', error: error.message });
//   }
// });



module.exports = router;



