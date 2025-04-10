import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AuthSessionGuard } from '../auth/guards/auth-session.guard';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { WithdrawalDto } from './dto/withdrawal.dto';
import { TransferDto } from './dto/transfer.dto';

@Controller('/wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @UseGuards(AuthSessionGuard)
  @Post('/fund')
  async fundWallet(@Request() req: any, @Body() dto: FundWalletDto) {
    return await this.walletService.fundWallet({
      walletId: req.user.walletId,
      amount: dto.amount,
    });
  }

  @UseGuards(AuthSessionGuard)
  @Post('/withdraw')
  async walletWithdrawal(@Request() req: any, @Body() dto: WithdrawalDto) {
    return await this.walletService.walletWithdrawal({
      walletId: req.user.id,
      amount: dto.amount,
    });
  }

  @UseGuards(AuthSessionGuard)
  @Post('/transfer')
  async transfer(@Request() req: any, @Body() dto: TransferDto) {
    return await this.walletService.transfer({
      senderWalletId: req.user.id,
      receiverWalletId: dto.receiverWalletId,
      amount: dto.amount,
    });
  }
}
