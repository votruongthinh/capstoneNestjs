import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterAvatarConfig } from 'src/common/multer/avatar-storage.multer';
import { User } from 'src/common/decorator/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('me')
  @UseInterceptors(FileInterceptor('avatar', MulterAvatarConfig.getOptions()))
  async updateProfile(
    @User() user: any,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.updateProfile(user.nguoi_dung_id, updateUserDto, file);
  }

  @Get('get-info')
  async getInfo(@User() user: any) {
    const result = await this.usersService.getInfo(user.nguoi_dung_id);
    return result;
  }

  // GET danh sách ảnh đã lưu
  @Get('saved-images')
  async getSavedImages(@User() user: any) {
    const result = this.usersService.getSavedImages(user.nguoi_dung_id);
    return result;
  }
}
