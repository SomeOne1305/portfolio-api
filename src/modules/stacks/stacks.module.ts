import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stack } from '../../entities/stack.entity';
import { StacksController } from './stacks.controller';
import { StacksService } from './stacks.service';

@Module({
  controllers: [StacksController],
  providers: [StacksService],
  imports: [TypeOrmModule.forFeature([Stack])],
})
export class StacksModule {}
