import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../../entities/project.entity';
import { User } from '../../entities/user.entity';
import { BotActions } from './bot.action';
import { BotUpdate } from './bot.update';
import { BotUtils } from './bot.utils';

@Module({
  controllers: [],
  providers: [BotUpdate, BotActions, BotUtils],
  imports: [TypeOrmModule.forFeature([User, Project])],
})
export class BotModule {}
