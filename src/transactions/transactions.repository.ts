import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entity/transaction.entity';
import { TransactionType } from '../constants';

@Injectable()
export class TransactionsRepository extends Repository<Transaction> {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {
    super(
      transactionRepository.target,
      transactionRepository.manager,
      transactionRepository.queryRunner,
    );
  }

  async createTransaction(data: Partial<Transaction>): Promise<Transaction> {
    const transaction = this.transactionRepository.create(data);
    return await this.transactionRepository.save(transaction);
  }

  async getTransactionById(id: number): Promise<Transaction> {
    return await this.transactionRepository.findOne({
      where: { id },
      relations: ['wallet'],
    });
  }

  async getTransactionsByFilter(filter: {
    walletId?: string;
    type?: TransactionType;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<{ transactions: Transaction[]; total: number }> {
    const {
      walletId,
      type,
      startDate,
      endDate,
      limit = 10,
      offset = 0,
    } = filter;

    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.wallet', 'wallet');

    if (walletId) {
      query.andWhere('transaction.walletId = :walletId', { walletId });
    }

    if (type) {
      query.andWhere('transaction.type = :type', { type });
    }

    if (startDate) {
      query.andWhere('transaction.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('transaction.createdAt <= :endDate', { endDate });
    }

    const [transactions, total] = await query
      .orderBy('transaction.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { transactions, total };
  }

  async updateTransaction(
    id: number,
    data: Partial<Transaction>,
  ): Promise<Transaction> {
    await this.transactionRepository.update(id, data);
    return await this.getTransactionById(id);
  }

  async getTransactionStats(
    walletId: string,
    period?: {
      startDate: Date;
      endDate: Date;
    },
  ): Promise<{
    totalTransactions: number;
    totalCredits: number;
    totalDebits: number;
    averageTransactionAmount: number;
  }> {
    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.walletId = :walletId', { walletId });

    if (period) {
      query
        .andWhere('transaction.createdAt >= :startDate', {
          startDate: period.startDate,
        })
        .andWhere('transaction.createdAt <= :endDate', {
          endDate: period.endDate,
        });
    }

    const transactions = await query.getMany();

    const stats = transactions.reduce(
      (acc, transaction) => {
        const amount = Number(transaction.amount);
        acc.totalTransactions++;
        acc.totalAmount += amount;

        if (transaction.type === TransactionType.CREDIT) {
          acc.totalCredits += amount;
        } else {
          acc.totalDebits += amount;
        }

        return acc;
      },
      {
        totalTransactions: 0,
        totalCredits: 0,
        totalDebits: 0,
        totalAmount: 0,
      },
    );

    return {
      totalTransactions: stats.totalTransactions,
      totalCredits: stats.totalCredits,
      totalDebits: stats.totalDebits,
      averageTransactionAmount:
        stats.totalTransactions > 0
          ? stats.totalAmount / stats.totalTransactions
          : 0,
    };
  }

  async getRecentTransactions(
    walletId: string,
    limit: number = 5,
  ): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      where: { walletId },
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['wallet'],
    });
  }

  async deleteTransaction(id: number): Promise<boolean> {
    const result = await this.transactionRepository.delete(id);
    return result.affected > 0;
  }
}
