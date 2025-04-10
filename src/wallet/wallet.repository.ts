import { Repository } from 'typeorm';
import { Wallet } from './entity/wallet.entity';
import { Injectable } from '@nestjs/common';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WalletRepository extends Repository<Wallet> {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {
    super(
      walletRepository.target,
      walletRepository.manager,
      walletRepository.queryRunner,
    );
  }

  async createWallet(data: Partial<Wallet>): Promise<Wallet> {
    const wallet = this.walletRepository.create(data);
    return await this.walletRepository.save(wallet);
  }

  async updateWallet(
    id: string,
    updateWalletDto: UpdateWalletDto,
  ): Promise<Wallet> {
    const response = await this.walletRepository.update(id, updateWalletDto);
    console.log('this is repository response', response);

    return await this.getWalletById(id);
  }

  async getWalletsByFilter(filter: Partial<Wallet>): Promise<Wallet[]> {
    return await this.walletRepository.find({
      where: filter,
      relations: ['user'],
    });
  }

  async getWalletById(id: string): Promise<Wallet> {
    return await this.walletRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async getUserWalletByFilter(filter: Partial<Wallet>): Promise<Wallet> {
    return await this.walletRepository.findOne({
      where: filter,
      relations: ['user'],
    });
  }
}
