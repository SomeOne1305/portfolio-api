import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ContactDto } from './dtos/contact.dto';
import { ISendMess } from './interfaces';
import { ToMessage } from './lib/utils';

@Injectable()
export class AppService {
  constructor(private http: HttpService) {}
  async sendMessage(body: ContactDto): Promise<any> {
    const message = ToMessage(body);
    const sendBody: ISendMess = {
      chat_id: 1267287288,
      text: message,
    };

    const req = await this.http.axiosRef.post(
      '/sendMessage?parse_mode=HTML',
      sendBody,
    );
    if (req.status == 200) {
      return {
        statusCode: 200,
        message: 'Thank you for your message',
      };
    } else {
      return new InternalServerErrorException(
        'Something went wrong in sending message',
      );
    }
  }
}
