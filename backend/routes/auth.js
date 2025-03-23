const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Account = require('../models/accounts');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

function generateAccountNumber() {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, phone, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        const user = new User({ first_name, last_name, email, phone, password: hashedPassword });
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

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, first_name: user.first_name, last_name: user.last_name, email: user.email, phone: user.phone }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ accessToken: token, 
        user: {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
        
        }
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
});
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
  

module.exports = router;
