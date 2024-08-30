import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { serve, setup } from 'swagger-ui-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // setupBot(app);
  app.enableCors();

  setupSwagger(app);

  const port = process.env.PORT || 8080;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

// function setupBot(app: INestApplication) {
//   const bot = app.get<Telegraf>(getBotToken());
//   app.use(bot.webhookCallback('/tg-bot'));
// }

function setupSwagger(app: INestApplication) {
  // Create Swagger configuration
  const config = new DocumentBuilder()
    .setTitle("Kholmuminov's Portfolio API")
    .setDescription(
      'This API is for <a href="https://portfolio.com">Kholmuminov`s Portfolio website</a>',
    )
    .setVersion('1.0')
    .build();

  // Generate Swagger document
  const document = SwaggerModule.createDocument(app, config);

  // Use swagger-ui-express to serve Swagger UI with correct static file paths
  app.use(
    '/swagger-ui',
    serve,
    setup(document, {
      swaggerOptions: {
        url: '/swagger-json', // URL where Swagger JSON is available
      },
      customCssUrl: '/swagger-ui.css', // Customize if needed, can be a local or external URL
    }),
  );

  // Serve Swagger JSON directly
  app.getHttpAdapter().get('/swagger-json', (req, res) => {
    res.json(document);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to bootstrap the application:', err);
});
