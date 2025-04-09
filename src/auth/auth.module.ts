import { Module } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { RedisModule } from '../redis/redis.module';
import { AuthController } from './auth.controller';
import { BcryptUtil } from '../utils/bcrypt.util';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [RedisModule, UserModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthRepository, BcryptUtil, AuthService],
  exports: [AuthRepository, AuthService],
})
export class AuthModule {}
