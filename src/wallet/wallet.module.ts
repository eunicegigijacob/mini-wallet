import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entity/wallet.entity';
import { WalletService } from './wallet.service';
import { WalletRepository } from './wallet.repository';
import { TransactionsModule } from '../transactions/transactions.module';
import { WalletController } from './wallet.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet]),
    TransactionsModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [WalletController],
  providers: [WalletService, WalletRepository],
  exports: [WalletService, WalletRepository],
})
export class WalletModule {}
