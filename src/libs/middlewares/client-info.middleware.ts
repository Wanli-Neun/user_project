import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ClientInfoMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const clientInfo = req.headers['user-agent'];

    if (!clientInfo) {
      throw new UnauthorizedException('Client info (User-Agent) is required');
    }

    (req as any).clientInfo = clientInfo;
    console.log(`Client Info: ${(req as any).clientInfo}`);

    next();
  }
}
