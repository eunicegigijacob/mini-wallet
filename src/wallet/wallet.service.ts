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
import { TransactionsRepository } from '../transactions/transactions.repository';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletRepository)
    private walletRepository: WalletRepository,
    private transactionsRepository: TransactionsRepository,
  ) {}

  generateTransactionRef(): string {
    // Generate a unique reference using UUID
    return `TRX-${uuidv4().substring(0, 8).toUpperCase()}`;
  }

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
      balance: balance,
    });

    console.log('this is updated', updatedWallet);
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

      // create credit transaction

      await this.transactionsRepository.createTransaction({
        walletId: wallet.id,
        type: TransactionType.CREDIT,
        reference: this.generateTransactionRef(),
        narration: 'Wallet funding',
        amount: data.amount,
      });

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

    await this.transactionsRepository.createTransaction({
      walletId: receiverWallet.id,
      type: TransactionType.DEBIT,
      reference: this.generateTransactionRef(),
      narration: `Transfer to ${receiverWallet.user.firstName + receiverWallet.user.lastName}`,
      amount: data.amount,
    });

    // credit receiver;

    await this.updateWalletBalance(
      { walletId: receiverWallet.id, amount },
      TransactionType.CREDIT,
    );

    await this.transactionsRepository.createTransaction({
      walletId: receiverWallet.id,
      type: TransactionType.CREDIT,
      reference: this.generateTransactionRef(),
      narration: `Transfer from ${senderWallet.user.firstName + senderWallet.user.lastName}`,
      amount: data.amount,
    });

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

    await this.transactionsRepository.createTransaction({
      walletId: wallet.id,
      type: TransactionType.DEBIT,
      reference: this.generateTransactionRef(),
      narration: `Withdrawal`,
      amount: data.amount,
    });

    return {
      success: true,
      message: 'successful withdrawal',
      data: { updatedWallet },
    };
  }

  async getWalletTransactions(walletId: string, filter: any) {
    const { startDate, endDate, page = 1, limit = 10 } = filter;
    const validWallet = await this.walletRepository.getWalletById(walletId);

    if (!validWallet) {
      throw new UnprocessableEntityException('Invalid wallet id');
    }

    // Calculate offset based on page and limit
    const offset = (page - 1) * limit;

    // Build query object with optional parameters
    const query: any = {
      walletId,
      limit,
      offset,
    };

    // Add date filters if provided
    if (startDate) {
      query.startDate = new Date(startDate);
    }

    if (endDate) {
      query.endDate = new Date(endDate);
    }

    const result =
      await this.transactionsRepository.getTransactionsByFilter(query);

    return {
      success: true,
      message: 'Successfully retrieved wallet transactions',
      data: {
        transactions: result.transactions,
        pagination: {
          total: result.total,
          page,
          limit,
          totalPages: Math.ceil(result.total / limit),
        },
      },
    };
  }

  async getWalletByUserId(userId: string) {
    const wallet = await this.walletRepository.getUserWalletByFilter({
      userId,
    });

    if (!wallet) {
      throw new UnprocessableEntityException('Wallet not found for this user');
    }

    return {
      success: true,
      message: 'Successfully retrieved user wallet',
      data: wallet,
    };
  }
}
