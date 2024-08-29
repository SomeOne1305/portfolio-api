import { Markup } from 'telegraf';
import { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';
import { ILang } from '../../interfaces';

export function MenuButtons(lang: ILang = 'eng'): InlineKeyboardButton[] {
  switch (lang) {
    case 'eng':
      return [
        Markup.button.callback('💼 About me', 'ABOUT'),
        Markup.button.callback('🚀 Projects', 'PROJECTS'),
        Markup.button.callback('📬 Contact', 'CONTACT'),
        Markup.button.callback('⚙️ Language', 'CHANGE_LANG'),
      ];
    case 'ru':
      return [
        Markup.button.callback('💼 Обо мне', 'ABOUT'),
        Markup.button.callback('🚀 Проекты', 'PROJECTS'),
        Markup.button.callback('📬 Контакт', 'CONTACT'),
        Markup.button.callback('⚙️ Язык', 'CHANGE_LANG'),
      ];
    case 'uz':
      return [
        Markup.button.callback('💼 Men haqimda', 'ABOUT'),
        Markup.button.callback('🚀 Loyihalar', 'PROJECTS'),
        Markup.button.callback("📬 Bog'lanish", 'CONTACT'),
        Markup.button.callback('⚙️ Til', 'CHANGE_LANG'),
      ];
  }
}

export function LangButtons(lang: ILang): InlineKeyboardButton[] {
  switch (lang) {
    case 'eng':
      return [
        Markup.button.callback('🇺🇿 Uzbek', 'LANG_UZ'),
        Markup.button.callback('🇷🇺 Russian', 'LANG_RU'),
        Markup.button.callback('🇬🇧 English', 'LANG_ENG'),
      ];
    case 'ru':
      return [
        Markup.button.callback('🇺🇿 Узбекский', 'LANG_UZ'),
        Markup.button.callback('🇷🇺 Русский', 'LANG_RU'),
        Markup.button.callback('🇬🇧 Английский', 'LANG_ENG'),
      ];
    case 'uz':
      return [
        Markup.button.callback("🇺🇿 O'zbekcha", 'LANG_UZ'),
        Markup.button.callback('🇷🇺 Ruscha', 'LANG_RU'),
        Markup.button.callback('🇬🇧 Inglizcha', 'LANG_ENG'),
      ];
  }
}

export function BackButton(lang: ILang, num: 0 | 1): InlineKeyboardButton[] {
  /*  switch(lang){
    case 'eng':;
    case "ru":;
    case 'uz':;
  } */
  const path = 'BACK_TO_MENU_' + num;
  switch (lang) {
    case 'eng':
      return [Markup.button.callback('Back to menu', path, false)];
    case 'ru':
      return [Markup.button.callback('Назад к меню', path, false)];
    case 'uz':
      return [Markup.button.callback('Menuga qaytish', path, false)];
  }
}

export function OK_Button() {
  return [Markup.button.callback('✅ OK', `OK`)];
}
