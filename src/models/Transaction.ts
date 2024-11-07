export enum TransactionType {
    FUNDING = 'FUNDING',
    TRANSFER = 'TRANSFER',
    WITHDRAWAL = 'WITHDRAWAL'
  }
  
  export enum TransactionStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
  }

export interface Transaction {
    id: string;
    walletId: string;
    type: TransactionType;
    amount: number;
    status: TransactionStatus;
    reference: string;
    createdAt: Date;
    updatedAt: Date;
  }