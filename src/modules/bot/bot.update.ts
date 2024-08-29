import { Action, Ctx, InjectBot, On, Start, Update } from 'nestjs-telegraf';
import { Markup, Telegraf } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';
import { CreateUserDto } from '../../dtos/user.dto';
import { TelegrafContext } from '../../interfaces';
import { BotActions, userSessions } from './bot.action';
import { LangButtons } from './bot.button';
import { BotUtils } from './bot.utils';

@Update()
export class BotUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<TelegrafContext>,
    private actions: BotActions,
    private utils: BotUtils,
  ) {}

  @Start()
  async StartCommand(@Ctx() ctx: TelegrafContext) {
    await ctx.setChatMenuButton({
      type: 'web_app',
      text: '🌐 portfolio',
      web_app: {
        url: 'https://portfolio-someone1305s-projects.vercel.app/',
      },
    });

    if (ctx.from.id === 1299414) {
      // Handle special case
    } else {
      const userAvailable = await this.utils.IsUserAvailable(ctx.from.id);
      if (userAvailable) {
        const user = await this.utils.getUser(ctx.from.id);
        await this.actions.wellcomeMessage(ctx, user.lang);
      } else {
        const { id, ...e } = ctx.from;
        const user: CreateUserDto = {
          ...e,
          telegram_id: id,
          lang: 'eng',
        };
        await this.utils.createUser(user);
        await ctx.sendMessage('Choose language:', {
          ...Markup.inlineKeyboard(LangButtons('eng')),
        });
      }
    }
  }

  @Action('CHANGE_LANG')
  async changeLang(@Ctx() ctx: TelegrafContext) {
    await this.actions.changeLanguage(ctx);
  }

  @Action('LANG_UZ')
  async replayUz(@Ctx() ctx: TelegrafContext) {
    await this.utils.setUserLang(ctx.from.id, 'uz');
    return await this.actions.onBackToMenu(ctx);
  }

  @Action('LANG_RU')
  async replayRu(@Ctx() ctx: TelegrafContext) {
    await this.utils.setUserLang(ctx.from.id, 'ru');
    return await this.actions.onBackToMenu(ctx);
  }

  @Action('LANG_ENG')
  async replayEng(@Ctx() ctx: TelegrafContext) {
    await this.utils.setUserLang(ctx.from.id, 'eng');
    return await this.actions.onBackToMenu(ctx);
  }

  @Action('PROJECTS')
  async showProjects(@Ctx() ctx: TelegrafContext) {
    await this.actions.showProjects(ctx, false); // Send new message
  }

  @Action(/next_(\d+)/)
  async nextPage(@Ctx() ctx: TelegrafContext & { match: RegExpMatchArray }) {
    const session = userSessions.get(ctx.from.id) || { page: 1 };
    session.page = parseInt(ctx.match[1], 10);
    userSessions.set(ctx.from.id, session);
    await this.actions.showProjects(ctx, true); // Edit existing message
  }

  @Action(/prev_(\d+)/)
  async prevPage(@Ctx() ctx: TelegrafContext & { match: RegExpMatchArray }) {
    const session = userSessions.get(ctx.from.id) || { page: 0 };
    session.page = parseInt(ctx.match[1], 10);
    userSessions.set(ctx.from.id, session);
    await this.actions.showProjects(ctx, true); // Edit existing message
  }

  @Action('ABOUT')
  async onAbout(@Ctx() ctx: TelegrafContext) {
    await this.actions.onAbout(ctx);
  }

  @Action(/BACK_TO_MENU_(\d+)/)
  async backToMenu(@Ctx() ctx: TelegrafContext) {
    const i = parseInt(ctx.match[1], 10);
    await this.actions.onBackToMenu(ctx, i == 1);
  }

  @Action('CONTACT')
  async contact(@Ctx() ctx: TelegrafContext) {
    await this.actions.onContact(ctx);
  }

  @Action(/OK/)
  async onOK(@Ctx() ctx: TelegrafContext) {
    await ctx.deleteMessage();
  }

  @On('text')
  async onMessage(
    @Ctx() ctx: TelegrafContext & { message: Message.TextMessage },
  ) {
    await this.actions.onMessageReceived(ctx);
  }
}
