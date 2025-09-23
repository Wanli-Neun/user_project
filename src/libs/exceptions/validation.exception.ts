import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor(public validationErrors: any) {
    super('Validation failed', HttpStatus.BAD_REQUEST);
  }
}
