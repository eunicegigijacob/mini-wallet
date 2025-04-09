import { Injectable } from '@nestjs/common';

@Injectable()
export class ReturnUserService {
  constructor() {}

  async execute(user: any): Promise<any> {
    return {
      id: user.id,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
    };
  }
}
