import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { Telegraf } from 'telegraf';
import { AppModule } from './app.module';

let server: INestApplication;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors({
  //   origin: ['http://localhost:3000'],
  //   allowedHeaders:
  //     'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
  //   methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
  //   credentials: true,
  // });
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle("Kholmuminov's Portfolio API")
    .setDescription(
      'This API is for <a href="portolio.com">Kholmuminov`s Portfolio website</a>',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  if (process.env.NODE_ENV !== 'production') {
    await app.listen(8080 || process.env.PORT);
  }
  if (process.env.NODE_ENV == 'production') return app;
}

if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  server = server ?? (await bootstrap());
  if (req.url === '/api') {
    const bot = server.get<Telegraf>(Telegraf);
    if (req.method === 'POST') {
      await bot.handleUpdate(req.body);
      res.status(200).end();
    } else {
      res.status(200).json({ status: 'Bot is running' });
    }
  } else {
    server.getHttpAdapter().getInstance()(req, res);
  }
}
