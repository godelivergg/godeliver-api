import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {

  const cors = require('cors');
  const app = await NestFactory.create(AppModule);

  app.use(cors({
    origin: "*",
  }));
  app.enableCors(
    {
      origin: "*",
      allowedHeaders: ['Accept', 'Content-Type'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    }
  )

  await app.listen(process.env.PORT || 8080);
}
bootstrap();
