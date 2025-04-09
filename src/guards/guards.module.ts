import { forwardRef, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthSessionGuard } from '../auth/guards/auth-session.guard';
// import { configs } from '../config';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => UserModule), forwardRef(() => AuthModule)],
  providers: [AuthSessionGuard, JwtService],
  exports: [AuthSessionGuard],
})
export class GuardsModule {}
