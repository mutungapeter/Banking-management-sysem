const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Account = require('../models/accounts');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const Transaction = require('../models/transactions');
const employeeAuth = require('../middlewares/employeeAuth');

function generateAccountNumber() {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

// for customer account creation
router.post('/register', async (req, res) => {
    const { first_name, last_name, email,
       phone, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        const user = new User({
           first_name, 
          last_name, 
          email,
          phone, 
          password: hashedPassword,
          role: 'customer'
         });
        await user.save();

        const account = new Account({
            userId: user._id,
            accountNumber: generateAccountNumber(),
            accountType: 'Savings',
            balance: 0
        });
        
        await account.save();
        // user.account = account._id;
        await user.save();

        res.status(201).json({ message: 'Account created successfully', accountNumber: account.accountNumber });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});




// For both customer and employee login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ 
      userId: user._id,
       first_name: user.first_name, 
       last_name: user.last_name,
      email: user.email, 
      phone: user.phone,
      role: user.role
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ accessToken: token, 
        user: {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
            role: user.role
        }
    });


// for customer profile
router.get('/profile', authMiddleware, async (req, res) => {
        try {
          const user = await User.findById(req.userId);
          console.log("user", user);
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
          
          const accounts = await Account.find({ userId: user._id });
          
          res.json({
            user: {
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              phone: user.phone,
            },
            accounts: accounts.map(account => ({
              id: account._id,
              accountNumber: account.accountNumber,
              accountType: account.accountType,
              balance: account.balance
            }))
          });
        } catch (error) {
          res.status(500).json({ message: 'Server error', error: error.message });
        }
      });
});

router.get('/profile', authMiddleware, async (req, res) => {
        try {
          const user = await User.findById(req.userId);
          console.log("user", user);
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
          
          const accounts = await Account.find({ userId: user._id });
          
          res.json({
            user: {
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              phone: user.phone,
            },
            accounts: accounts.map(account => ({
              id: account._id,
              accountNumber: account.accountNumber,
              accountType: account.accountType,
              balance: account.balance
            }))
          });
        } catch (error) {
          res.status(500).json({ message: 'Server error', error: error.message });
        }
      });

// for customer profile update
router.put('/update-profile', authMiddleware, async (req, res) => {
    try {
      const { first_name, last_name, phone, email } = req.body;
      const updates = {};
      
      if (first_name) updates.first_name = first_name;
      if (last_name) updates.last_name = last_name;
      if (phone) updates.phone = phone;
      if (email) updates.email = email;
      
      const user = await User.findByIdAndUpdate(
        req.userId,
        { $set: updates },
        { new: true }
      );
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({
        message: 'Profile updated successfully',
        user: {
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });   

// EMPLOYEE ROUTES
/*
for employee account creation by an employee ,
in mind that an employee can have authorization to create an employee
 account(adding new employee to the system)
*/

/*Creating first employee account , the url on frontend will be only known to the admin*/
router.post('/create-first-employee', async (req, res) => {
  try {
    // Check if any employees already exist
    const employeeCount = await User.countDocuments({ role: 'employee' });
    
    if (employeeCount > 0) {
      return res.status(403).json({ 
        message: 'First employee already exists. This endpoint is no longer available.' 
      });
    }
    
    const { first_name, last_name, email, phone, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const firstEmployee = new User({
      first_name,
      last_name,
      email,
      phone,
      password: hashedPassword,
      role: 'employee'
    });
    
    await firstEmployee.save();
    
    res.status(201).json({
      message: 'First employee created successfully',
      employee: {
        id: firstEmployee._id,
        first_name: firstEmployee.first_name,
        last_name: firstEmployee.last_name,
        email: firstEmployee.email,
        phone: firstEmployee.phone,
        role: firstEmployee.role
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.post('/register-employee', authMiddleware, async (req, res) => {

  if (req.userRole !== 'employee') {
      return res.status(403).json({ 
        message: 'Unauthorized: Only employees can register using this endpoinnt' });
  }
  
  const { first_name, last_name, email, phone, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
      const employee = new User({ 
          first_name, 
          last_name, 
          email, 
          phone, 
          password: hashedPassword,
          role: 'employee'
      });
      
      await employee.save();
      
      res.status(201).json({ 
          message: 'Employee registered successfully',
          employee: {
              id: employee._id,
              first_name: employee.first_name,
              last_name: employee.last_name,
              email: employee.email
          }
      });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});


// 1. List all customers
router.get('/customers', authMiddleware, employeeAuth, async (req, res) => {
  try {
    const { accountNumber, first_name } = req.query;
    
    // If accountNumber is provided, search by account number
    if (accountNumber) {
      // First find the account with the given account number
      const account = await Account.findOne({ accountNumber });
      
      if (!account) {
        return res.json({ customers: [] });
      }
      
      const customer = await User.findOne({ _id: account.userId, role: 'customer' })
        .select('_id first_name last_name email phone');
      
      return res.json({ customers: customer ? [customer] : [] });
    }
    
    // Build query - always filter for customers
    const query = { role: 'customer' };
    
    // Add first_name filter if provided
    if (first_name) {
      query.first_name = { $regex: first_name, $options: 'i' }; // Case-insensitive search
    }
    
    // Find customers matching the query
    const customers = await User.find(query)
      .select('_id first_name last_name email phone');
    
    res.json({ customers });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
//get customer details including accounts , and transactions history
router.get('/customer/:id', authMiddleware, employeeAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the customer
    const customer = await User.findById(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    // Get customer accounts
    const accounts = await Account.find({ userId: id });
    
    // Get account IDs for transaction lookup
    const accountIds = accounts.map(account => account._id);
    
    // Get transactions for all customer accounts
    const transactions = await Transaction.find({
      $or: [
        { accountId: { $in: accountIds } },
        { recipientAccountId: { $in: accountIds } }
      ]
    })
    .populate('accountId', 'accountNumber accountType')
    .populate('recipientAccountId', 'accountNumber accountType')
    .sort({ date: -1 });
    
    // Format the response
    res.status(200).json({
      customer: {
        id: customer._id,
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        phone: customer.phone,
      },
      accounts: accounts.map(account => ({
        id: account._id,
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        balance: account.balance,
        createdAt: account.createdAt
      })),
      transactions: transactions
    });
    
  } catch (error) {
    console.error('Error fetching customer details:', error);
    res.status(500).json({ message: 'Failed to fetch customer details', error: error.message });
  }
});



router.put('/update-customer-info/:id', authMiddleware, employeeAuth, async (req, res) => {
  try {
    const { first_name, last_name, email, phone } = req.body;
    const updates = {};
    
    if (first_name) updates.first_name = first_name;
    if (last_name) updates.last_name = last_name;
    if (email) updates.email = email;
    if (phone) updates.phone = phone;
    
    const customer = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'customer' },
      { $set: updates },
      { new: true }
    ).select('_id first_name last_name email phone');
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.json({
      message: 'Customer information updated successfully',
      customer
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 5. Create a new account for existing customer
router.post('/customers/:id/accounts', authMiddleware, employeeAuth, async (req, res) => {
  try {
    const customer = await User.findOne({ _id: req.params.id, role: 'customer' });
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    const { accountType, initialDeposit } = req.body;
    const balance = initialDeposit || 0;
    
    const account = new Account({
      userId: customer._id,
      accountNumber: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
      accountType,
      balance
    });
    
    await account.save();
    
    // If there's an initial deposit, create a transaction
    if (initialDeposit && initialDeposit > 0) {
      const transaction = new Transaction({
        accountId: account._id,
        type: 'deposit',
        amount: initialDeposit,
        description: 'Initial deposit',
        date: new Date()
      });
      
      await transaction.save();
    }
    
    res.status(201).json({
      message: 'Account created successfully',
      account: {
        id: account._id,
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        balance: account.balance
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



  

module.exports = router;
