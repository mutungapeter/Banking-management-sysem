import { Transaction } from "@/definitions";

export const formatTransaction = (transaction: Transaction) => {
  const date = new Date(transaction.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Determine if transaction is outgoing (red) or incoming (green)
  const isOutgoing = ["transfer_out", "withdrawal"].includes(transaction.type);
  
  // Get account details
  const accountNumber = transaction.accountId?.accountNumber;
  const accountType = transaction.accountId?.accountType;

  let title = "";
  let details = "";

  if (transaction.type === "transfer_out" && transaction.recipientAccountId) {
    title = `Transfer to account ${transaction.recipientAccountId.accountNumber}`;
    details = `From ${accountType} (${accountNumber.slice(-4)}) to ${
      transaction.recipientAccountId.accountType
    } (${transaction.recipientAccountId.accountNumber.slice(-4)})`;
  } else if (transaction.type === "transfer_in" && transaction.senderAccountId) {
    const senderAccountNumber =
      typeof transaction.senderAccountId === "string"
        ? transaction.senderAccountId
        : transaction.senderAccountId.accountNumber;
    const senderAccountType =
      typeof transaction.senderAccountId === "string"
        ? "Account"
        : transaction.senderAccountId.accountType;

    title = `Transfer from account ${senderAccountNumber}`;
    details = `From ${senderAccountType} (${senderAccountNumber.slice(-4)}) to ${accountType} (${accountNumber.slice(-4)})`;
  } else if (transaction.type === "deposit" || transaction.type === "initial_deposit") {
    title = `Deposit to account ${accountNumber}`;
    details = `To ${accountType} (${accountNumber.slice(-4)})`;
  } else if (transaction.type === "withdrawal") {
    title = `Withdrawal from account ${accountNumber}`;
    details = `From ${accountType} (${accountNumber.slice(-4)})`;
  } else if (transaction.type === "interest_earned") {
    title = `Interest earned on account ${accountNumber}`;
    details = `Interest applied at ${transaction.interestRate || ''}% for ${transaction.term || '1'} year(s)`;
  }

  return {
    id: transaction._id,
    title,
    details,
    formattedDate,
    formattedTime,
    isOutgoing,
    amount: transaction.amount
  };
};