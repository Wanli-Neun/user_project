import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { ValidationException } from '../exceptions/validation.exception';

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(400).json({
      statusCode: 400,
      message: 'Validation failed',
      errors: this.formatErrors(exception.validationErrors),
    });
  }

  private formatErrors(errors: ValidationException['validationErrors']) {
    return errors.map(err => ({
      property: err.property,
      constraints: err.constraints,
    }));
  }
}
