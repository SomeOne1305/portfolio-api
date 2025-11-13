import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegrafModule } from 'nestjs-telegraf';
import { join } from 'path';
import * as swagger from 'swagger-ui-dist';
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
      token: process.env.TELEGRAM_BOT_TOKEN,
      middlewares: [
        new RedisSession({
          store: {
            host: process.env.REDIS_URL,
            port: 14738,
            password: 'bx7NrQsE3hxYZONIdEn0VcBgQO3JpjYh',
          },
        }).middleware(),
      ],
      // launchOptions:
      //   process.env.NODE_ENV === 'production'
      //     ? { webhook: { domain: process.env.VERCEL_URL, path: '/tg-bot' } }
      //     : ({ polling: true } as Telegraf.LaunchOptions),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: 'postgres',
        // host: 'localhost',
        // port: 5432,
        // username: 'postgres',
        // password: '12345678',
        // database: 'portfolio',
        url: process.env.DB_URL,
        ssl: true,
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: true,
      }),
    }),
    HttpModule.register({
      baseURL:
        'https://api.telegram.org/bot' + process.env.TELEGRAM_BOT_TOKEN,
    }),
    CacheModule.register({
      max: 100,
      store:
        process.env.REDIS_URL,
      isGlobal: true,
      ttl: 10,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: swagger.getAbsoluteFSPath(),
      serveRoot: '/swagger-ui',
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
