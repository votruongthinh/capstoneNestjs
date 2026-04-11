import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from 'src/common/decorator/user.decorator';

@Controller('comments/:imageId')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async createComment(
    @Param('imageId', ParseIntPipe) imageId: number,
    @User() user: any,
    @Body() body: CreateCommentDto,
  ) {
    const result = await this.commentsService.createComment(
      imageId,
      user.nguoi_dung_id,
      body,
    );
    return result;
  }

  @Get()
  async getCommentsByImageId(@Param('imageId', ParseIntPipe) imageId: number) {
    const result = await this.commentsService.getCommentsByImageId(imageId);
    return result;
  }
}
