import {
  Controller,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Patch,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthSessionGuard } from '../auth/guards/auth-session.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthSessionGuard)
  @Get('/')
  async getUserProfile(@Request() req: any) {
    return await this.userService.getUserProfile(req.user.id);
  }

  @UseGuards(AuthSessionGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('/update')
  async updateUser(@Request() req: any, @Body() dto: UpdateUserDto) {
    const { id } = req.user;
    return await this.userService.updateUser(id, {
      ...dto,
    });
  }

  @UseGuards(AuthSessionGuard)
  @Get('/wallets/balance')
  getWalletBalance(@Request() req: any) {
    return this.userService.getWalletBalance(req.user.id);
  }

  @UseGuards(AuthSessionGuard)
  @Get('/wallets/transactions')
  async getWalletTransactions(@Request() req: any) {
    return await this.userService.getWalletTransactions(req.user.id, req.query);
  }
}
