import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegrafModule } from 'nestjs-telegraf';
import { join } from 'path';
import { Telegraf } from 'telegraf';
import RedisSession from 'telegraf-session-redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotModule } from './modules/bot/bot.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { StacksModule } from './modules/stacks/stacks.module';
@Module({
  imports: [
    TelegrafModule.forRoot({
      token: '7149624258:AAERhmhXDvr9EOSvCW07PfAzxbbzW-DG5i0',
      middlewares: [
        new RedisSession({
          store: {
            host: 'driven-crow-60904.upstash.io',
            port: 6379,
            password:
              'Ae3oAAIjcDE3ZjY4YTk1YTMzODQ0N2NkOTk4YTY4NDU4N2RjZjc1MXAxMA',
          },
        }).middleware(),
      ],
      launchOptions:
        process.env.NODE_ENV === 'production'
          ? { webhook: { domain: process.env.VERCEL_URL } }
          : ({ polling: true } as Telegraf.LaunchOptions),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: 'postgres',
        // host: 'localhost',
        // port: 5432,
        // username: 'postgres',
        // password: '12345678',
        // database: 'portfolio',
        url: 'postgres://default:BxeObYjM6H2g@ep-polished-wildflower-a4u5k8c3-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require',
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: true,
      }),
    }),
    HttpModule.register({
      baseURL:
        'https://api.telegram.org/bot7149624258:AAERhmhXDvr9EOSvCW07PfAzxbbzW-DG5i0',
    }),
    CacheModule.register({
      max: 100,
      store:
        'redis://default:AcI_AAIjcDE5YTMyMThhMGQwMTU0ZTVkOTI5ZTYyNjY4NGEzNGMwYnAxMA@healthy-bull-49727.upstash.io:6379',
      isGlobal: true,
      ttl: 10,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BotModule,
    ProjectsModule,
    FirebaseModule,
    StacksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
