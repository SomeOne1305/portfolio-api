import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateStackDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Category icon',
  })
  icon: Express.Multer.File;
}

export class EditStackDto {
  @ApiProperty({ required: false })
  @IsOptional()
  name: string;
}
