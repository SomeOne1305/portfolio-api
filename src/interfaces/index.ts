import { Context } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

class MatchArray extends Array<string | undefined> {
  0?: string;
  1?: string;
  index?: number;
  input?: string;
  groups?: string;
}

export class TelegrafContext extends Context<Update> {
  match: MatchArray;
  session: {
    isContacting?: boolean;
    user?: number;
    replyToUserId: null | number;
    replyToMessageId: null | number;
  };
  replyToMessage(message, extra) {
    return this.reply(
      message,
      Object.assign({ reply_to_message_id: this.message.message_id }, extra),
    );
  }
}

export interface IContact {
  name: string;
  email: string;
  username: string;
  message: string;
}

export interface ISendMess {
  chat_id: number;
  text: string;
}

export type ILang = 'uz' | 'ru' | 'eng';
