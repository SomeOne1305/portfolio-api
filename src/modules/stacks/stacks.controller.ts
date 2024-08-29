import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateStackDto, EditStackDto } from '../../dtos/stacks.dto';
import { StacksService } from './stacks.service';

@ApiTags('stacks')
@Controller('stacks')
export class StacksController {
  constructor(private readonly stacksService: StacksService) {}

  @UseInterceptors(CacheInterceptor)
  @Get('all')
  async getAllStacks() {
    return await this.stacksService.getStacks();
  }

  @Post('create')
  @ApiOperation({ summary: 'Upload a stack with icon image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Project data and file upload',
    type: CreateStackDto,
  })
  @UseInterceptors(FileInterceptor('icon'))
  @UsePipes(new ValidationPipe())
  async createStack(
    @Body() body: CreateStackDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    // console.log(Object.assign(body, { icon: file }));

    return await this.stacksService.createStack(
      Object.assign(body, { icon: file }),
    );
  }

  @Put('edit/:id')
  @UsePipes(new ValidationPipe())
  @ApiBody({
    description: 'Edit stack data and file upload',
    type: EditStackDto,
    required: false,
  })
  async editStack(@Param('id') id: string, @Body() body: EditStackDto) {
    return await this.stacksService.editStack(id, body);
  }

  @Delete('delete/:id')
  async deleteStack(@Param('id') id: string) {
    return await this.stacksService.deleteStack(id);
  }
}
