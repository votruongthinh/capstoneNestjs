import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules-api/auth/auth.module';
import { PrismaModule } from './modules-system/prisma/prisma.module';
import { TokenModule } from './modules-system/token/token.module';
import { ImagesModule } from './modules-api/images/images.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ProtectGuard } from './common/guard/protect.guard';
import { UsersModule } from './modules-api/users/users.module';
import { CommentsModule } from './modules-api/comments/comments.module';
import { SavedImageModule } from './modules-api/saved-image/saved-image.module';
import { LoggingInterceptor } from './common/interceptor/logging.interceptor';
import { ResponseSuccessInterceptor } from './common/interceptor/response-success.interceptor';

@Module({
  imports: [AuthModule, PrismaModule, TokenModule, ImagesModule, UsersModule, CommentsModule, SavedImageModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ProtectGuard,
    },
    {
      provide:APP_INTERCEPTOR,
      useClass:ResponseSuccessInterceptor,
    },
    {
      provide:APP_INTERCEPTOR,
      useClass:LoggingInterceptor,
    },
  ],
})
export class AppModule {}
