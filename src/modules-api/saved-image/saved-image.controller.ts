import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UnauthorizedException } from '@nestjs/common';
import { SavedImageService } from './saved-image.service';
import { CreateSavedImageDto } from './dto/create-saved-image.dto';

import { User } from 'src/common/decorator/user.decorator';

@Controller('saved-image')
export class SavedImageController {
  constructor(private readonly savedImageService: SavedImageService) {}


  @Post('create')
  async saveImage(
    @Body() body: CreateSavedImageDto,
    @User() user: any,
  ) {
    return await this.savedImageService.saveImage(
      body.hinh_id,
      user.nguoi_dung_id,
    );
  }

  @Get(':imageId/is-saved')
  async isSaved(
  @Param('imageId', ParseIntPipe) imageId: number,   // đổi tên rõ ràng
  @User() user: any
  ) {
 
  const result = await this.savedImageService.isSave(imageId, user.nguoi_dung_id);

  console.log('Kết quả trả về từ service:', result);

  return result;  
  }
}
