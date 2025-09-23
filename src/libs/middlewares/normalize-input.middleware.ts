import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class NormalizeInputMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.body && typeof req.body === 'object') {
      this.normalizeObject(req.body);
    }

    if (req.query && typeof req.query === 'object') {
      this.normalizeObject(req.query);
    }

    if (req.params && typeof req.params === 'object') {
      this.normalizeObject(req.params);
    }

    next();
  }

  private normalizeObject(obj: any) {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        let value = obj[key].trim();
        if (key.toLowerCase().includes('email')) {
          value = value.toLowerCase();
        }
        obj[key] = value;
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        this.normalizeObject(obj[key]);
      }
    }
  }
}
