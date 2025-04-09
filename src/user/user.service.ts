import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './entity/user.entity';
import { WalletRepository } from '../wallet/wallet.repository';
import { ReturnUserService } from './return-user.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly walletRepository: WalletRepository,
    private readonly returnUser: ReturnUserService,
  ) {}

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
      message: 'successfully created user',
      data: { user: await this.returnUser.execute(user) },
    };
  }

  async updateUser(userId: string, userData: Partial<User>) {
    const validUser = await this.userRepository.findById(userId);
    if (!validUser) {
      throw new UnprocessableEntityException('Invalid user id');
    }
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
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnprocessableEntityException('Invalid user, user not found');
    }

    const userWallet = await this.walletRepository.getUserWalletByFilter({
      user,
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
}
