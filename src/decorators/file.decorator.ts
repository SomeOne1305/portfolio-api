import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'FileIsNotEmpty', async: true })
@Injectable()
export class FileIsNotEmpty implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(value: Express.Multer.File, args: ValidationArguments) {
    return !!value; // True if the file is defined
  }
}
