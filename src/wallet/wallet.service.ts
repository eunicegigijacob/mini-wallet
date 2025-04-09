import {
  Injectable,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletRepository } from './wallet.repository';
import { TransactionType } from '../constants';
import { IFundWallet } from './interface/fund-wallet.interface';
import { ITransfer } from './interface/transfer.interface';
import { IWithdrawal } from './interface/withdrawal.interface';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletRepository)
    private walletRepository: WalletRepository,
  ) {}

  async getWalletById(id: string) {
    const wallet = await this.walletRepository.getWalletById(id);

    if (!wallet) {
      throw new UnprocessableEntityException('Invalid wallet id');
    }

    return {
      success: true,
      message: 'successfully retrieved wallet',
      data: wallet,
    };
  }

  async updateWalletBalance(transDetails: IFundWallet, type: TransactionType) {
    const { walletId, amount } = transDetails;
    const wallet = await this.walletRepository.getWalletById(walletId);

    if (!wallet) {
      throw new UnprocessableEntityException('Invalid wallet id');
    }

    let balance: number;

    if (type === TransactionType.CREDIT) {
      balance = wallet.balance + amount;
    } else {
      balance = wallet.balance - amount;
    }

    const updatedWallet = await this.walletRepository.updateWallet(wallet.id, {
      balance,
    });
    return updatedWallet;
  }

  async checkValidTransaction(walletBalance: number, amount: number) {
    if (walletBalance - amount < 0) {
      return false;
    }

    return true;
  }

  async fundWallet(data: IFundWallet) {
    try {
      // get the wallet
      const { data: wallet } = await this.getWalletById(data.walletId);

      if (!wallet) {
        throw new BadRequestException('Invalid wallet id');
      }

      const updatedWallet = await this.updateWalletBalance(
        data,
        TransactionType.CREDIT,
      );

      return {
        success: true,
        message: 'Wallet funding successful',
        data: {
          updatedWallet,
        },
      };
    } catch (error: any) {
      console.log(`error funding wallet:  ${error}`);
      throw new UnprocessableEntityException(error.message);
    }
  }

  async transfer(data: ITransfer) {
    // get the sender wallet and check if amount to transfer is enough.
    const { senderWalletId, receiverWalletId, amount } = data;
    const { data: senderWallet } = await this.getWalletById(senderWalletId);

    const balanceIsEnough = await this.checkValidTransaction(
      senderWallet.balance,
      amount,
    );

    if (!balanceIsEnough) {
      throw new UnprocessableEntityException('Insufficient funds');
    }

    const { data: receiverWallet } = await this.getWalletById(receiverWalletId);

    // debit sender

    await this.updateWalletBalance(
      { walletId: senderWalletId, amount },
      TransactionType.DEBIT,
    );

    // credit receiver;

    await this.updateWalletBalance(
      { walletId: receiverWallet.id, amount },
      TransactionType.CREDIT,
    );

    return {
      success: true,
      message: `successfully transferred ${amount} to wallet ${receiverWalletId}`,
      data: {},
    };
  }

  async walletWithdrawal(data: IWithdrawal) {
    const { amount, walletId } = data;
    // get user wallet

    const { data: wallet } = await this.getWalletById(walletId);

    // validate transaction

    const balanceIsEnough = await this.checkValidTransaction(
      wallet.balance,
      amount,
    );

    if (!balanceIsEnough) {
      throw new UnprocessableEntityException('Insufficient funds');
    }

    const updatedWallet = await this.updateWalletBalance(
      { walletId: wallet.id, amount },
      TransactionType.DEBIT,
    );

    return {
      success: true,
      message: 'successful withdrawal',
      data: { updatedWallet },
    };
  }
}
