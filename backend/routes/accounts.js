const express = require("express");
const User = require("../models/users");
const Account = require("../models/accounts");
const Transaction = require("../models/transactions");
const authMiddleware = require("../middlewares/authMiddleware");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
  try {
    // Find all accounts belonging to the user
    const accounts = await Account.find({ userId: req.userId });

    if (!accounts || accounts.length === 0) {
      return res.status(200).json({
        totalBalance: 0,
        accounts: [],
      });
    }

    // Calculate total balance across all accounts
    const totalBalance = accounts.reduce(
      (sum, account) => sum + account.balance,
      0
    );

    // Return both total balance and individual account balances
    res.status(200).json({
      totalBalance,
      accounts: accounts.map((account) => ({
        id: account._id,
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        balance: account.balance,
      })),
    });
  } catch (error) {
    console.error("Error retrieving balance:", error);
    res
      .status(500)
      .json({ message: "Error retrieving balance", error: error.message });
  }
});

/**
 * Create a new bank account
 * Implements the POST /account endpoint documented in Swagger
 */
router.post("/create-bank-account", authMiddleware, async (req, res) => {
  try {
    const { accountType, initialDeposit } = req.body;

    if (!accountType || !["Savings", "Checking"].includes(accountType)) {
      return res
        .status(400)
        .json({
          message: "Valid account type (Savings or Checking) is required",
        });
    }

    // Validate initial deposit if provided
    const initialAmount = initialDeposit ? parseFloat(initialDeposit) : 0;
    if (initialDeposit && (isNaN(initialAmount) || initialAmount <= 0)) {
      return res
        .status(400)
        .json({ message: "Initial deposit must be a positive number" });
    }

    const accountNumber = Math.floor(
      1000000000 + Math.random() * 9000000000
    ).toString();
    const newAccount = await Account.create({
      userId: req.userId,
      accountNumber,
      accountType,
      balance: initialAmount,
    });

    // Create an initial deposit transaction if there was an initial deposit
    if (initialAmount > 0) {
      await Transaction.create({
        accountId: newAccount._id,
        type: "initial_deposit",
        amount: initialAmount,
      });
    }

    res.status(201).json({
      message: "Account created successfully",
      account: {
        id: newAccount._id,
        accountNumber: newAccount.accountNumber,
        accountType: newAccount.accountType,
        balance: newAccount.balance,
        createdAt: newAccount.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating account:", error);
    res
      .status(500)
      .json({ message: "Error creating account", error: error.message });
  }
});

router.post("/deposit", authMiddleware, async (req, res) => {
  const { amount, accountId, description } = req.body;
  console.log("amount", amount);
  console.log("accountId", accountId);
  console.log("description", description);
  const account = await Account.findById(accountId);
  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }
  if (account.userId.toString() !== req.userId) {
    return res
      .status(403)
      .json({
        message: "You do not have permission to deposit to this account",
      });
  }

  const depositAmount = parseFloat(amount);
  account.balance += depositAmount;
  await account.save();
  const transactionData = {
    accountId: account._id,
    type: "deposit",
    amount: depositAmount,
  };
  if (description) {
    transactionData.description = description;
  }

  await Transaction.create(transactionData);

  res.json({ message: "Deposit successful", balance: account.balance });
});

router.post("/withdraw", authMiddleware, async (req, res) => {
  const { amount, accountId, description } = req.body;
  const account = await Account.findById(accountId);

  if (account.balance < amount) {
    return res.status(400).json({ message: "Insufficient funds" });
  }
  const withdrawAmount = parseFloat(amount);
  account.balance -= withdrawAmount;
  await account.save();
  const transactionData = {
    accountId: account._id,
    type: "withdrawal",
    amount: withdrawAmount,
  };
  if (description) {
    transactionData.description = description;
  }
  await Transaction.create(transactionData);

  res.json({ message: "Withdrawal successful", balance: account.balance });
});

router.post("/transfer", authMiddleware, async (req, res) => {
  try {
    const { recipientAccountId, senderAccountId, amount, description } =
      req.body;
    console.log("recipientAccountId", recipientAccountId);
    console.log("senderAccountId", senderAccountId);
    console.log("amount", amount);
    console.log("description", description);
    const transferAmount = parseFloat(amount);

    // Find sender account and verify ownership
    const senderAccount = await Account.findById(senderAccountId);
    if (!senderAccount) {
      return res.status(404).json({ message: "Sender account not found" });
    }

    // Ensure the sender account belongs to the authenticated user
    if (senderAccount.userId.toString() !== req.userId) {
      return res
        .status(403)
        .json({
          message: "You do not have permission to transfer from this account",
        });
    }

    // Find recipient account
    const recipientAccount = await Account.findById(recipientAccountId);
    if (!recipientAccount) {
      return res.status(404).json({ message: "Recipient account not found" });
    }

    // Check for sufficient funds
    if (senderAccount.balance < transferAmount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    // Process the transfer
    senderAccount.balance -= transferAmount;
    recipientAccount.balance += transferAmount;

    await senderAccount.save();
    await recipientAccount.save();

    const senderTransactionData = {
      accountId: senderAccount._id,
      type: "transfer_out",
      amount: transferAmount,
      recipientAccountId: recipientAccount._id,
    };

    const recipientTransactionData = {
      accountId: recipientAccount._id,
      type: "transfer_in",
      amount: transferAmount,
      senderAccountId: senderAccount._id,
    };

    if (description) {
      senderTransactionData.description = description;
      recipientTransactionData.description = description;
    }
    // Record two transactions - one for sender and one for recipient
    await Transaction.create(senderTransactionData);
    await Transaction.create(recipientTransactionData);

    res.json({
      message: "Transfer successful",
      balance: senderAccount.balance,
    });
  } catch (error) {
    console.error("Error processing transfer:", error);
    res.status(500).json({
      message: "Error processing transfer",
      error: error.message,
    });
  }
});

router.get("/transactions", authMiddleware, async (req, res) => {
  const account = await Account.findOne({ userId: req.userId });
  const transactions = await Transaction.find({ accountId: account._id });
  res.json(transactions);
});

/**
 * Get all accounts for the authenticated user
 * Implements the GET /account endpoint documented in Swagger
 */
router.get("/user-bank-accounts", authMiddleware, async (req, res) => {
  try {
    const { accountType } = req.query;
    const filter = { userId: req.userId };
    if (accountType && ["Savings", "Checking"].includes(accountType)) {
      filter.accountType = accountType;
    }
    const accounts = await Account.find(filter);

    if (!accounts || accounts.length === 0) {
      return res.status(200).json({
        message: "No accounts found for this user",
        accounts: [],
      });
    }

    res.status(200).json({
      message: "Accounts retrieved successfully",
      accounts: accounts.map((account) => ({
        id: account._id,
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        balance: account.balance,
        createdAt: account.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error retrieving accounts:", error);
    res
      .status(500)
      .json({ message: "Error retrieving accounts", error: error.message });
  }
});

/**
 * Delete a bank account
 * Implements the DELETE /account/{id} endpoint documented in Swagger
 */
router.delete("/delete-bank-account/:id", authMiddleware, async (req, res) => {
  try {
    const accountId = req.params.id;

    // Find the account and verify ownership
    const account = await Account.findById(accountId);

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Ensure the account belongs to the authenticated user
    if (account.userId.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete this account" });
    }

    // Check if account has balance
    if (account.balance > 0) {
      return res.status(400).json({
        message:
          "Cannot delete account with positive balance. Please withdraw or transfer all funds first.",
        balance: account.balance,
      });
    }

    // Delete associated transactions
    await Transaction.deleteMany({ accountId: accountId });

    // Delete the account
    await Account.findByIdAndDelete(accountId);

    res.status(200).json({
      message: "Account deleted successfully",
      accountNumber: account.accountNumber,
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    res
      .status(500)
      .json({ message: "Error deleting account", error: error.message });
  }
});

router.post("/calculate-interest", authMiddleware, async (req, res) => {
  try {
    const { accountId, interestRate, termYears } = req.body;

    // Validate inputs
    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required" });
    }

    const rate = parseFloat(interestRate);
    const term = parseFloat(termYears);

    if (isNaN(rate) || rate <= 0) {
      return res
        .status(400)
        .json({ message: "Interest rate must be a positive number" });
    }

    if (isNaN(term) || term <= 0) {
      return res
        .status(400)
        .json({ message: "Term years must be a positive number" });
    }

    // Find the account and verify ownership
    const account = await Account.findById(accountId);

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Ensure the account belongs to the authenticated user
    if (account.userId.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "You do not have permission to access this account" });
    }

    // Calculate interest (using compound interest formula)
    const principal = account.balance;
    const rateDecimal = rate / 100;
    const projectedBalance = principal * Math.pow(1 + rateDecimal, term);
    const interestEarned = projectedBalance - principal;

    // Return the calculation results
    res.status(200).json({
      accountNumber: account.accountNumber,
      currentBalance: principal.toFixed(2),
      interestRate: rate.toFixed(2) + "%",
      termYears: term,
      interestEarned: interestEarned.toFixed(2),
      projectedBalance: projectedBalance.toFixed(2),
    });
  } catch (error) {
    console.error("Error calculating interest:", error);
    res
      .status(500)
      .json({ message: "Error calculating interest", error: error.message });
  }
});

router.post("/apply-interest", authMiddleware, async (req, res) => {
  try {
    const { accountId, interestRate, termYears } = req.body;

    // Validate inputs
    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required" });
    }

    const rate = parseFloat(interestRate);
    const term = parseFloat(termYears);

    if (isNaN(rate) || rate <= 0) {
      return res
        .status(400)
        .json({ message: "Interest rate must be a positive number" });
    }

    if (isNaN(term) || term <= 0) {
      return res
        .status(400)
        .json({ message: "Term years must be a positive number" });
    }

    // Find the account and verify ownership
    const account = await Account.findById(accountId);

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Ensure the account belongs to the authenticated user
    if (account.userId.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "You do not have permission to access this account" });
    }

    // Calculate interest (using compound interest formula)
    const principal = account.balance;
    const rateDecimal = rate / 100;
    const projectedBalance = principal * Math.pow(1 + rateDecimal, term);
    const interestEarned = projectedBalance - principal;

    // Round to 2 decimal places for currency
    const roundedInterestEarned = Math.round(interestEarned * 100) / 100;

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update account balance
      account.balance += roundedInterestEarned;
      await account.save({ session });

      // Create transaction record

      const transaction = new Transaction({
        accountId: account._id,
        type: "interest_earned",
        amount: roundedInterestEarned,
        interestRate: rate,
        termYears: term,
        description: `Interest applied at ${rate}% for ${term} year(s)`,
        date: new Date(),
      });

      await transaction.save({ session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      // Return the updated account info
      res.status(200).json({
        message: "Interest applied successfully",
        accountNumber: account.accountNumber,
        previousBalance: principal.toFixed(2),
        interestRate: rate.toFixed(2) + "%",
        termYears: term,
        interestApplied: roundedInterestEarned.toFixed(2),
        newBalance: account.balance.toFixed(2),
        transactionId: transaction._id,
      });
    } catch (error) {
      // Abort transaction on error
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error("Error applying interest:", error);
    res
      .status(500)
      .json({ message: "Error applying interest", error: error.message });
  }
});

module.exports = router;
