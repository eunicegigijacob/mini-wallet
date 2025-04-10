import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { WalletRepository } from '../wallet/wallet.repository';

@Injectable()
export class ReturnUserService {
  constructor(private readonly walletRepository: WalletRepository) {}

  async execute(user: User): Promise<any> {
    // const wallet = await this.walletRepository.getUserWalletByFilter({
    //   user: user,
    // });
    // console.log(wallet, '/////////////////////////////', user.wallet);
    return {
      id: user.id,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      phone: user.phone,
      // wallet_balance: wallet.balance,
    };
  }
}
