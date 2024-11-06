export enum WalletStatus {
  ACTIVE = 'ACTIVE',
  FROZEN = 'FROZEN',
  CLOSED = 'CLOSED'
}


export interface Wallet {
    id: string;
    userId: string;
    balance: number;
    status: WalletStatus;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
  }