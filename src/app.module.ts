import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { configs } from './config/index';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';
import { GuardsModule } from './guards/guards.module';
import { JwtModule } from '@nestjs/jwt';
import { Transaction } from 'typeorm';
import { User } from './user/entity/user.entity';
import { Wallet } from './wallet/entity/wallet.entity';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: configs.DATABASE_HOST,
      port: +configs.DATABASE_PORT,
      username: configs.DATABASE_USER,
      password: configs.DATABASE_PASS,
      database: configs.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
      entities: [User, Wallet, Transaction],
    }),
    JwtModule.register({
      global: true,
      secret: configs.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    RedisModule,
    AuthModule,
    UserModule,
    WalletModule,
    GuardsModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
