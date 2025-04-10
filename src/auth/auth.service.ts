import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { DecodedToken } from './interface/decoded-token.interface';
import { configs } from '../config';
import { UserRepository } from '../user/user.repository';
import { BcryptUtil } from '../utils/bcrypt.util';
import { LoginInterface } from './interface/login.interface';
import { SignupInterface } from './interface/signup.interface';
import { WalletRepository } from '../wallet/wallet.repository';
import { ReturnUserService } from '../user/return-user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
    private readonly bcryptUtil: BcryptUtil,
    private readonly walletRepository: WalletRepository,
    private readonly returnUserService: ReturnUserService,
  ) {}

  checkIfTokenHasExpired(expiryTime: string): boolean {
    const currentTime = new Date().getTime();
    const expiryTimeFullFormat = new Date(expiryTime).getTime();

    if (currentTime > expiryTimeFullFormat) return true; // Token has expired
    return false; // Token has not expired
  }

  getOtpExpiryTime() {
    return new Date(new Date().getTime() + 1000 * 60 * 10); // 10 mins
  }

  createAuthTokens(payload: DecodedToken) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: 60 * 60, // 1hr
      secret: configs.JWT_SECRET,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '1d',
      secret: configs.JWT_REFRESH_TOKEN_SECRET,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(user: any) {
    try {
      this.authRepository.createSession(user.id, user);

      this.authRepository.createRefreshSession(user.id, user);

      const { accessToken, refreshToken } = this.createAuthTokens(user);

      return {
        status: true,
        message: 'Tokens successfully refreshed',
        data: {
          tokens: {
            accessToken,
            refreshToken,
          },
        },
      };
    } catch (error) {
      console.log(error);
      return;
    }
  }

  validatePasswordString(password: string) {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;

    if (!password.match(regex)) {
      throw new BadRequestException(
        'Password must contain at least a capital letter, number & greater than 8 characters.',
      );
    }

    return true;
  }

  async signUp({
    email,
    password,
    firstName,
    lastName,
    phone,
  }: SignupInterface) {
    // Check if user already exists
    const existingUser = await this.userRepository.findOneUserByQuery({
      email,
    });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Validate password
    this.validatePasswordString(password);

    // Hash password
    const hashedPassword = await this.bcryptUtil.hash(password);

    // Create new user
    const newUser = await this.userRepository.create({
      email,
      firstName,
      lastName,
      phone,
      password: hashedPassword,
    });

    // create wallet for user

    const createdWallet = await this.walletRepository.createWallet({
      userId: newUser.id,
    });

    console.log('the users wallet', createdWallet);

    return {
      status: true,
      message: 'Account created successfully',
      data: {
        user: await this.returnUserService.execute(newUser),
      },
    };
  }

  async login({ email, password }: LoginInterface) {
    // Find user by email
    const user = await this.userRepository.findOneUserByQuery({ email });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await this.bcryptUtil.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    // Generate tokens
    const { accessToken, refreshToken } = this.createAuthTokens({
      id: user.id.toString(),
    });

    const sessionPayload = {
      id: user.id,
      email: user.email,
      walletId: user.wallet.id,
    };

    await this.authRepository.createSession(user.id, sessionPayload);

    console.log('this is  user,', user);

    return {
      status: true,
      message: 'Login successful',
      data: {
        user: await this.returnUserService.execute(user),
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    };
  }
}
