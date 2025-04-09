import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async returnUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
    };
  }
}
