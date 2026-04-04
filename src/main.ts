import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser'


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //gắn cookie parser vào app để có thể sử dụng cookie trong các controller
  app.use(cookieParser());
  //api global prefix
  app.setGlobalPrefix('api');
  const PORT = 3069;
  await app.listen(PORT, () => {
    console.log(`Start BE successfully at http://localhost:${PORT}`);
  });
}
bootstrap();
