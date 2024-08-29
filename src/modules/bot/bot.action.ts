import { Injectable } from '@nestjs/common';
import { Ctx } from 'nestjs-telegraf';
import { Markup } from 'telegraf';
import { Message, User } from 'telegraf/typings/core/types/typegram';
import { ILang, TelegrafContext } from '../../interfaces';
import { projectText } from '../../lib/utils';
import { BackButton, LangButtons, MenuButtons, OK_Button } from './bot.button';
import { BotUtils } from './bot.utils';
import {
  aboutMessage,
  contactMessage,
  thankYouMessage,
  warningToAdm,
  warningToUser,
  welcomeMessage,
} from './messages';

export const userSessions = new Map<number, { page: number }>();

@Injectable()
export class BotActions {
  constructor(private utils: BotUtils) {}

  async wellcomeMessage(ctx: TelegrafContext, lang: ILang) {
    await ctx.sendMessage(welcomeMessage[lang], {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard(MenuButtons(lang), { columns: 3 }),
    });
  }

  async onAbout(@Ctx() ctx: TelegrafContext) {
    const user = await this.utils.getUser(ctx.from.id);
    await ctx.editMessageText(aboutMessage[user?.lang], {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([BackButton(user?.lang, 0)]),
    });
  }

  async onBackToMenu(@Ctx() ctx: TelegrafContext, del: boolean = false) {
    const user = await this.utils.getUser(ctx.from.id);
    if (del) {
      await ctx.deleteMessage();
    } else {
      await ctx.editMessageText(welcomeMessage[user.lang], {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard(MenuButtons(user.lang), { columns: 3 }),
      });
    }
  }

  async showProjects(@Ctx() ctx: TelegrafContext, editMessage: boolean) {
    const session = userSessions.get(ctx.from.id) || { page: 1 };
    const { data, total } = await this.utils.getProjectOneByOne(session.page);

    const buttons = [];

    if (session.page > 1) {
      buttons.push(
        Markup.button.callback('⬅️ Prev', `prev_${session.page - 1}`),
      );
    }

    if (session.page < total) {
      buttons.push(
        Markup.button.callback('Next ➡️', `next_${session.page + 1}`),
      );
    }

    buttons.push(Markup.button.callback('🔙 Back to Menu', 'BACK_TO_MENU_1'));

    const projectMessage = {
      caption: projectText(data?.[0]),
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard(buttons, { columns: 2 }),
    };

    if (editMessage) {
      await ctx.editMessageMedia({
        type: 'photo',
        media: data?.[0].imgUrl,
      });
      console.log(projectMessage);
      await ctx.editMessageCaption(projectMessage.caption, {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard(buttons, {
          columns: session.page > 1 && session.page < total ? 2 : 1,
        }),
      });
    } else {
      await ctx.replyWithPhoto(data?.[0].imgUrl, {
        caption: projectMessage.caption,
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard(buttons, { columns: 2 }),
      });
    }
  }

  async changeLanguage(ctx: TelegrafContext) {
    const user = await this.utils.getUser(ctx.from.id);

    await ctx.editMessageText(
      user.lang == 'eng'
        ? 'Select language:'
        : user.lang == 'ru'
          ? 'Выберите язык:'
          : 'Tilni tanlang:',
      {
        ...Markup.inlineKeyboard(LangButtons(user.lang)),
      },
    );
  }

  async onContact(ctx: TelegrafContext) {
    const user = await this.utils.getUser(ctx.from.id);
    if (ctx.from.id !== 1267287288) {
      ctx.session.isContacting = true;
      ctx.session.user = ctx.from.id;
      await ctx.reply(contactMessage[user.lang]);
    } else {
      const warning = await ctx.sendMessage(warningToAdm[user.lang]);
      setTimeout(async () => await ctx.deleteMessage(warning.message_id), 2500);
    }
  }

  async onMessageReceived(
    ctx: TelegrafContext & { message: Message.TextMessage },
  ) {
    const user = await this.utils.getUser(ctx.from.id);
    if (ctx.from.id !== 1267287288) {
      if (ctx.session.isContacting && ctx.session.user == ctx.from.id) {
        await ctx.telegram.forwardMessage(
          1267287288, // Admin's Telegram ID
          ctx.from.id, // User's Telegram ID
          ctx.message.message_id, // Message ID of the user's message
        );
        await ctx.deleteMessage(ctx.message.message_id);
        ctx.session.isContacting = false;
        await ctx.sendMessage(thankYouMessage[user.lang]);
      } else {
        await ctx.deleteMessage(ctx.message.message_id);
        const warning = await ctx.sendMessage(warningToUser[user.lang]);
        setTimeout(
          async () => await ctx.deleteMessage(warning.message_id),
          2500,
        );
      }
    } else {
      if (ctx.message.reply_to_message) {
        const replyMessage = ctx.message.reply_to_message;

        if ('forward_from' in replyMessage) {
          const forwardFrom = replyMessage.forward_from as User | undefined;
          if (forwardFrom && forwardFrom.id) {
            await ctx.telegram.sendMessage(forwardFrom.id, ctx.message.text, {
              reply_markup: Markup.inlineKeyboard(OK_Button()).reply_markup,
            });
          }
        } else {
          console.log('Reply message does not have a forward_from property');
        }
      } else {
        setTimeout(async () => await ctx.deleteMessage(), 700);
        const warning = await ctx.sendMessage('NO_COMMAND_OR_RES');
        setTimeout(
          async () => await ctx.deleteMessage(warning.message_id),
          700,
        );
      }
    }
  }
}
