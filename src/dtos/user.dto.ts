export class CreateUserDto {
  telegram_id: number;

  is_bot: boolean;

  first_name: string;

  last_name?: string;

  username?: string;

  language_code?: string;

  is_premium?: true;

  added_to_attachment_menu?: true;

  lang: 'uz' | 'ru' | 'eng';
}
