import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './entity/user.entity';
import { WalletRepository } from '../wallet/wallet.repository';
import { ReturnUserService } from './return-user.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly walletRepository: WalletRepository,
    private readonly returnUser: ReturnUserService,
    private readonly walletService: WalletService,
  ) {}

  async validateUser(userId: string) {
    const validUser = await this.userRepository.findById(userId);
    if (!validUser) {
      throw new UnprocessableEntityException('Invalid user id');
    }

    return validUser;
  }

  async createUser(userData: Partial<User>) {
    const user = await this.userRepository.create(userData);
    if (!user) return null;

    return {
      success: true,
      message: 'successfully created user',
      data: await this.returnUser.execute(user),
    };
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.find({ email });
    if (!user) {
      throw new UnprocessableEntityException('Invalid user email');
    }

    return {
      success: true,
      message: 'successfully created user',
      data: { user: await this.returnUser.execute(user[0]) },
    };
  }

  async getUserProfile(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnprocessableEntityException('Invalid user, user not found');
    }
    return {
      success: true,
      message: 'successfully retrieved user profile',
      data: { user: await this.returnUser.execute(user) },
    };
  }

  async updateUser(userId: string, userData: Partial<User>) {
    await this.validateUser(userId);
    const user = await this.userRepository.update(userId, userData);
    if (!user) {
      throw new UnprocessableEntityException('Error updating user');
    }
    return {
      success: true,
      message: 'successfully updated user',
      data: { user: await this.returnUser.execute(user) },
    };
  }

  async getWalletBalance(userId: string) {
    const user = await this.validateUser(userId);

    const userWallet = await this.walletRepository.getUserWalletByFilter({
      id: user.wallet.id,
    });

    if (!userWallet) {
      throw new UnprocessableEntityException('Error fetching user wallet');
    }

    return {
      success: true,
      message: 'successfully retrieved user wallet',
      data: {
        balance: userWallet.balance,
      },
    };
  }

  async getWalletTransactions(userId: string, query: any) {
    const user = await this.validateUser(userId);

    return this.walletService.getWalletTransactions(user.wallet.id, query);
  }
}
