import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}
  async createComment(
    imageId: number,
    user: number, // ← Nhận userId thay vì toàn bộ user object
    body: CreateCommentDto,
  ) {
    const imageExists = await this.prisma.hinh_anh.findFirst({
      where: {
        hinh_anh_id: imageId,
        isDeleted: false,
      },
    });

    if (!imageExists) {
      throw new BadRequestException(`Không tìm thấy ảnh với id = ${imageId}`);
    }

    const comment = await this.prisma.binh_luan.create({
      data: {
        hinh_id: imageId,
        nguoi_dung_id: user, // ← Dùng userId
        noi_dung: body.noi_dung,
        ngay_binh_luan: new Date(),
      },
      include: {
        nguoi_dung: {
          select: {
            nguoi_dung_id: true,
            ho_ten: true,
            anh_dai_dien: true,
          },
        },
      },
    });
    return {
      success: true,
      message: 'Bình luận đã được đăng thành công',
      comment: comment,
    };
  }

  async getCommentsByImageId(imageId: number) {
    const imageExists = await this.prisma.hinh_anh.findFirst({
      where: { hinh_anh_id: imageId, isDeleted: false },
    });

    if (!imageExists) {
      throw new BadRequestException(`Không tìm thấy ảnh với id = ${imageId}`);
    }

    return this.prisma.binh_luan.findMany({
      where: {
        hinh_id: imageId,
        isDeleted: false,
      },
      include: {
        nguoi_dung: {
          select: {
            nguoi_dung_id: true,
            ho_ten: true,
            anh_dai_dien: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
