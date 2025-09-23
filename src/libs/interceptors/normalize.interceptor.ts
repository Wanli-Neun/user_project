import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class NormalizeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (request.body && typeof request.body === 'object') {
      this.normalizeObject(request.body);
    }

    if (request.query && typeof request.query === 'object') {
      this.normalizeObject(request.query);
    }

    if (request.params && typeof request.params === 'object') {
      this.normalizeObject(request.params);
    }

    return next.handle().pipe(
      map((data) => {
        return data;
      }),
    );
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
