import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exceptions-filter';
import { configs } from './config';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set('trust proxy', 1);

  app.setGlobalPrefix('/v1');

  app.enableCors({
    credentials: true,
    origin: function (origin, callback) {
      callback(null, true);
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      skipMissingProperties: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  app.use(cookieParser());

  const port = configs.SERVER_PORT || 3000;

  await app.listen(port, async () => {
    console.log(
      `The server is running on ${port} port: http://localhost:${port} `,
    );
  });
}

bootstrap();
