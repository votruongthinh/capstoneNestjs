import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

  app.setGlobalPrefix('api');

  // app.useStaticAssets(join(__dirname, '..', 'public'), {
  //   prefix: '/',
  // });

  const PORT = 3069;
  await app.listen(PORT, () => {
    console.log(`Start BE successfully at http://localhost:${PORT}`);
  });
}
bootstrap();