import { Injectable } from '@nestjs/common';
import { DecodedToken } from './interface/decoded-token.interface';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly redisService: RedisService) {}

  async createSession(userId: string, payload: DecodedToken) {
    // const id = uuid.v4();
    const key = `auth:sessions:${userId}`;

    // TODO: Push to array instead
    const currentSession = await this.redisService.get({ key });

    if (currentSession) {
      // Logout current active session
      await this.redisService.remove({ key });
    }

    await this.redisService.set({
      key,
      value: payload,
      ttl: 60 * 60, // 1hr
    });

    return userId;
  }

  async createRefreshSession(userId: string, payload: DecodedToken) {
    const key = `auth:refreshSessions:${userId}`;
    // TODO: Push to array instead
    const currentSession = await this.redisService.get({ key });

    if (currentSession) {
      // Logout current active session
      await this.redisService.remove({ key });
    }

    await this.redisService.set({
      key,
      value: payload,
      ttl: 60 * 60 * 24, // 1day
    });

    return userId;
  }

  async getSession(userId: string) {
    const key = `auth:sessions:${userId}`;
    const session = await this.redisService.get({ key });

    if (!session || session === '') return false;

    return session;
  }

  async setUserLastSeen(userId: string) {
    const key = `user:last-seen:${userId}`;

    await this.redisService.set({
      key,
      value: new Date(Date.now()).toISOString(),
      ttl: 60 * 10, // 10mins
    });

    return true;
  }

  async getRefreshSession(userId: string) {
    const key = `auth:refreshSessions:${userId}`;
    const session = await this.redisService.get({ key });

    if (!session || session === '') return false;

    return session;
  }

  async deleteSession(userId: string) {
    const key = `auth:sessions:${userId}`;

    await this.redisService.remove({ key });

    return true;
  }
}
