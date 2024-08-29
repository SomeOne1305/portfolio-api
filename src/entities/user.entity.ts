import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ILang } from '../interfaces';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'bigint', nullable: true })
  telegram_id: number;

  @Column({ nullable: true })
  is_bot: boolean;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  language_code: string;

  @Column({ nullable: true })
  is_premium: true;

  @Column({ nullable: true })
  added_to_attachment_menu: true;

  @Column()
  lang: ILang;
}
