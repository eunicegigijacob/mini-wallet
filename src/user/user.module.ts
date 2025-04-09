import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { WalletModule } from '../wallet/wallet.module';
import { GuardsModule } from '../guards/guards.module';
import { ReturnUserService } from './return-user.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    WalletModule,
    forwardRef(() => GuardsModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserRepository, UserService, ReturnUserService],
  exports: [UserRepository, UserService, ReturnUserService],
})
export class UserModule {}
