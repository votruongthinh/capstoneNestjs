import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterConfig } from 'src/common/multer/disk-storage.multer';
import { User } from 'src/common/decorator/user.decorator';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image', MulterConfig.getOptions()))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() creteImageDto: CreateImageDto,
    @User() user: any,
  ) {
    const result = await this.imagesService.uploadImage(
      file,
      creteImageDto,
      user,
    );
    return result;
  }

  @Get()
  async findAll(@Req() req) {
    // ✅ chỉ gọi service
    const result = await this.imagesService.findAll(req);
    return result;
  }

  @Get('search')
  async findByName(@Req() req: any) {
    const result = await this.imagesService.findByName(req);
    return result;
  }

  @Get(':id')
  async getImageDetail(@Param('id', ParseIntPipe) id: number) {
    const result = await this.imagesService.getImageDetail(id);
    return result;
  }

  @Delete(':id')
  async deleteImage(@Param('id', ParseIntPipe) id: number, @User() user: any) {
    const result = await this.imagesService.deleteImage(id, user.nguoi_dung_id);
    return result;
  }
  @Patch(':id/restore')
  async restore(@Param('id', ParseIntPipe) id: number, @User() user: any) {
    const result = await this.imagesService.restore(id, user.nguoi_dung_id);
    return result;
  }
  @Delete(':id/hard')
  async deleteHard(@Param('id', ParseIntPipe) id: number, @User() user: any) {
    const result = await this.imagesService.deleteHard(id, user.nguoi_dung_id);
    return result;
  }
}
