export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Wallet {
    id: string;
    userId: string;
    balance: number;
    status: 'active' | 'frozen' | 'closed';
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Transaction {
    id: string;
    walletId: string;
    type: 'credit' | 'debit';
    amount: number;
    reference: string;
    status: 'pending' | 'completed' | 'failed';
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
  }
  