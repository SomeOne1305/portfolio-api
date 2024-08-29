import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ContactDto } from './dtos/contact.dto';

@ApiTags('Main')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('contact')
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: ContactDto, required: true })
  async sendMessageToAdm(@Body() body: ContactDto) {
    return await this.appService.sendMessage(body);
  }
}
