import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.status ?? 500;

    let message = '';

    message = exception?.response?.message ?? exception.message;

    // if (exception.name === MONGO_ERROR) {
    //   if (exception.code === 11000) {
    //     message = 'A duplicate resource was provided.';
    //   }
    // }

    console.log(exception);

    this.logger.error(exception.name ?? exception.message);

    return response.status(status).json({
      status: false,
      message,
      data: {},
    });
  }
}
