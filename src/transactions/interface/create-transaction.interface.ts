import { TransactionType } from '../../constants';

export interface ICreateTransaction {
  walletId: string;
  type: TransactionType;
  amount: number;
  narration?: string;
  reference: string;
}
