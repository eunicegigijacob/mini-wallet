import { Injectable, Logger } from '@nestjs/common';
import * as redis from 'redis';
import { configs } from '../config';

@Injectable()
export class RedisService {
  redisClient: redis.RedisClientType;
  public redis_url: string;

  private readonly logger = new Logger(RedisService.name);

  constructor() {
    this.redis_url = `${configs.REDIS_URL}`;
    this.redisClient = redis.createClient({
      url: this.redis_url,
      socket: {
        keepAlive: 1,
      },
      pingInterval: 10000,
    });

    this.redisClient
      .connect()
      .then(() =>
        this.logger.log('Connection estalblished to Redis instance ...'),
      )
      .catch((error) => this.handleError(error));
  }

  handleError(error: any) {
    this.logger.error(`Redis error: ${error.message}`);
    return false;
  }

  async set({ key, value, ttl }: { key: string; value: any; ttl?: number }) {
    try {
      const options = ttl && ttl !== 0 ? { EX: ttl } : undefined;

      const result = await this.redisClient.set(
        key,
        JSON.stringify(value),
        options,
      );

      return result;
    } catch (error: any) {
      this.logger.error(`REDIS SET ERROR: ${error.message}`);
      return false;
    }
  }

  async get({ key }: { key: string }): Promise<string | boolean> {
    try {
      const result = await this.redisClient.get(key);
      if (!result || result === '') return false;

      return JSON.parse(result);
    } catch (error: any) {
      this.logger.error(`REDIS get ERROR: ${error.message}`);
      return false;
    }
  }
  async remove({ key }: { key: string }) {
    try {
      const result = await this.redisClient.del(key);
      return result;
    } catch (error: any) {
      this.logger.error(`REDIS remove ERROR: ${error.message}`);
      return false;
    }
  }
}
