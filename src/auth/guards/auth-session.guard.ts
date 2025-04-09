import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthRepository } from '../auth.repository';
import { configs } from '../../config';
import { DecodedToken } from '../interface/decoded-token.interface';

@Injectable()
export class AuthSessionGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async decodeToken(token: string): Promise<DecodedToken | boolean> {
    try {
      const decodedToken = (await this.jwtService.verifyAsync(token, {
        secret: configs.JWT_SECRET,
      })) as any;

      return decodedToken;
    } catch (error) {
      return false;
    }
  }

  async validateRequest(request: Request): Promise<boolean> {
    const headerBearerToken = (request.headers.authorization as string) ?? null;
    const queryBearerToken = (request.query.authorization as string) ?? null;

    if (!headerBearerToken && !queryBearerToken)
      throw new UnauthorizedException(
        'Please provide Bearer token in Authorization header.',
      );

    const authToken = queryBearerToken ?? headerBearerToken.split(' ')[1];

    if (!authToken)
      throw new UnauthorizedException(
        'Auth token not found in Authorization header.',
      );

    const decodedToken = (await this.decodeToken(authToken)) as DecodedToken;

    if (!decodedToken)
      throw new HttpException(
        'Invalid auth token or token has expired, please login to get new token.',
        419,
      );

    const session = await this.authRepository.getSession(decodedToken.id);

    if (!session) throw new HttpException('Please login again.', 419);

    await this.authRepository.setUserLastSeen(session['id']);

    request['user'] = session;

    return true;
  }
}
