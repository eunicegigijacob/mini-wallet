import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionsRepository } from './transactions.repository';
import { Transaction } from './entity/transaction.entity';
import { TransactionType } from '../constants';
import { v4 as uuidv4 } from 'uuid';

interface ServiceResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  generateTransactionRef(): string {
    // Generate a unique reference using UUID
    return `TRX-${uuidv4().substring(0, 8).toUpperCase()}`;
  }

  async createTransaction(data: any): Promise<ServiceResponse<Transaction>> {
    // Generate a unique reference if not provided
    const reference = this.generateTransactionRef();

    // Create the transaction
    const transaction = await this.transactionsRepository.createTransaction({
      ...data,
      reference,
    });

    return {
      success: true,
      message: 'Transaction created successfully',
      data: transaction,
    };
  }

  async getTransactionByFilter(filter: {
    walletId?: string;
    type?: TransactionType;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<ServiceResponse<{ transactions: Transaction[]; total: number }>> {
    const result =
      await this.transactionsRepository.getTransactionsByFilter(filter);

    return {
      success: true,
      message: 'Transactions retrieved successfully',
      data: result,
    };
  }

  async getTransactionByWalletId(
    walletId: string,
    options: {
      limit?: number;
      offset?: number;
      type?: TransactionType;
    } = {},
  ): Promise<ServiceResponse<{ transactions: Transaction[]; total: number }>> {
    const result = await this.transactionsRepository.getTransactionsByFilter({
      walletId,
      ...options,
    });

    return {
      success: true,
      message: 'Wallet transactions retrieved successfully',
      data: result,
    };
  }

  async getTransactionById(id: number): Promise<ServiceResponse<Transaction>> {
    const transaction =
      await this.transactionsRepository.getTransactionById(id);
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return {
      success: true,
      message: 'Transaction retrieved successfully',
      data: transaction,
    };
  }

  async getTransactionStats(
    walletId: string,
    period?: { startDate: Date; endDate: Date },
  ): Promise<
    ServiceResponse<{
      totalTransactions: number;
      totalCredits: number;
      totalDebits: number;
      averageTransactionAmount: number;
    }>
  > {
    const stats = await this.transactionsRepository.getTransactionStats(
      walletId,
      period,
    );

    return {
      success: true,
      message: 'Transaction statistics retrieved successfully',
      data: stats,
    };
  }

  async getRecentTransactions(
    walletId: string,
    limit: number = 5,
  ): Promise<ServiceResponse<Transaction[]>> {
    const transactions =
      await this.transactionsRepository.getRecentTransactions(walletId, limit);

    return {
      success: true,
      message: 'Recent transactions retrieved successfully',
      data: transactions,
    };
  }
}
