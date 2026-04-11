import { Module } from '@nestjs/common';
import { SavedImageService } from './saved-image.service';
import { SavedImageController } from './saved-image.controller';

@Module({
  controllers: [SavedImageController],
  providers: [SavedImageService],
})
export class SavedImageModule {}
