import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp({
      ...dto,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() dto: LoginDto, @Res() res: Response) {
    const result = (await this.authService.login({
      ...dto,
    })) as any;

    return res.send({
      status: true,
      message: 'Sign in successful',
      data: {
        user: result.user,
        tokens: result.tokens,
      },
    });
  }
}
