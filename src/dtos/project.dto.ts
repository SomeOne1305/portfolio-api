import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUrl, MinLength } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty({ description: 'Name of the project' })
  title: string;

  @IsNotEmpty()
  @MinLength(15)
  @ApiProperty({ description: 'Description of the project' })
  description: string;

  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({ description: 'URL of the project' })
  url: string;

  @ApiProperty({
    type: 'string',
    isArray: true,
    description: 'Categories of the project',
  })
  categories: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Project file',
  })
  file: Express.Multer.File;
}

export class UpdateProjectDto {
  @IsOptional()
  @MinLength(5)
  @ApiProperty({ description: 'Name of the project', required: false })
  title?: string;

  @IsOptional()
  @MinLength(15)
  @ApiProperty({ description: 'Description of the project', required: false })
  description?: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty({ description: 'URL of the project', required: false })
  url?: string;

  @ApiProperty({
    type: 'string',
    isArray: true,
    description: 'Categories of the project',
    required: false,
  })
  @IsOptional()
  categories?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Project file',
    required: false,
  })
  @IsOptional()
  file?: Express.Multer.File;
}
