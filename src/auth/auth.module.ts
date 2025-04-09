import { forwardRef, Module } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { RedisModule } from '../redis/redis.module';
import { AuthController } from './auth.controller';
import { BcryptUtil } from '../utils/bcrypt.util';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { WalletModule } from '../wallet/wallet.module';
import { AuthSessionGuard } from './guards/auth-session.guard';

@Module({
  imports: [forwardRef(() => UserModule), RedisModule, WalletModule],
  controllers: [AuthController],
  providers: [AuthRepository, BcryptUtil, AuthService, AuthSessionGuard],
  exports: [AuthRepository, AuthService, AuthSessionGuard],
})
export class AuthModule {}
