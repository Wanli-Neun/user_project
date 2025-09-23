import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);

    res.on('finish', () => {
      console.log(
        `RequestId = ${(req as any).requestId} took ${Date.now() - start}ms`,
      );
    });

    next();
  }
}
