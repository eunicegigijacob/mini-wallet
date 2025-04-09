export interface ITransfer {
  senderWalletId: string;
  receiverWalletId: string;
  amount: number;
  description?: string;
}
