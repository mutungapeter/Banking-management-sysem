export interface Account {
  id: string;
  accountType: string;
  balance: number;
  accountNumber: string;
  createdAt: string;
}

export interface ProfileInfo {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export interface Transaction {
    _id: string;
    accountId: {
      _id: string;
      accountNumber: string;
      accountType: string;
    };
    amount: number;
    date: string;
    type: 'transfer_in' | 'transfer_out' | 'deposit' | 'withdrawal' | 'initial_deposit' | 'interest_earned';
    recipientAccountId?: {
      _id: string;
      accountNumber: string;
      accountType: string;
    };
    senderAccountId?: string | {
      _id: string;
      accountNumber: string;
      accountType: string;
    };
    interestRate?: number;
    term?: number;
    __v: number;
  }

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}
