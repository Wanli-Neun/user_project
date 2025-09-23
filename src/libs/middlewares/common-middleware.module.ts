import {Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import {RequestIdMiddleware} from '../middlewares/request-id.middleware';
import {NormalizeInputMiddleware} from '../middlewares/normalize-input.middleware';
import { LoggerMiddleware } from '../middlewares/logger.middleware';
import { ClientInfoMiddleware } from './client-info.middleware';


@Module({
  providers: [RequestIdMiddleware, NormalizeInputMiddleware, LoggerMiddleware, ClientInfoMiddleware],
})
export class CommonMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        RequestIdMiddleware,
        LoggerMiddleware,
        ClientInfoMiddleware
      )
      .forRoutes('*');

    consumer
      .apply(NormalizeInputMiddleware)
      .forRoutes('users');
  }
}
