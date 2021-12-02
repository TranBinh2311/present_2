import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { IsNotEmpty, validate } from 'class-validator';

@Injectable()
export class CustomValidatePipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    if (this.IsEmpty(value)) {
      throw new BadRequestException('Validate failed: No value provided  ');
    }
    //console.log(value);
    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    //console.log(errors);

    if (errors.length > 0) {
      throw new BadRequestException(
        ` Validation failed: ${this.formatError(errors)}`,
      );
    }

    //return value;
    return {
      name: value.name,
      number: value.age,
    };
  }

  private formatError(errors: any[]) {
    return errors
      .map((error) => {
        for (let key in error.constraints) {
          return error.constraints[key];
        }
      })
      .join(', ');
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private IsEmpty(value: any) {
    if (Object.keys(value).length < 1) {
      return true;
    }
    return false;
  }
}
