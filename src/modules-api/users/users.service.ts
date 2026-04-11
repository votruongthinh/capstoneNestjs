import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Cập nhật thông tin cá nhân + ảnh đại diện (gộp chung 1 method)
  async updateProfile(userId: number, dto: UpdateUserDto, file?: Express.Multer.File) {
    // 1. Kiểm tra có gửi dữ liệu gì không (ảnh hoặc thông tin)
    if (!file && !dto.ho_ten && dto.tuoi === undefined) {
      throw new BadRequestException('Vui lòng cung cấp thông tin cần cập nhật');
    }

    // 2. Kiểm tra user tồn tại
    const userExist = await this.prisma.nguoi_dung.findFirst({
      where: { nguoi_dung_id: Number(userId), isDeleted: false },
    });

    if (!userExist) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    // 3. Tạo object data chỉ chứa field được gửi lên
    const dataToUpdate: Record<string, any> = {};
    if (dto.ho_ten !== undefined) dataToUpdate.ho_ten = dto.ho_ten;
    if (dto.tuoi !== undefined) dataToUpdate.tuoi = Number(dto.tuoi);

    // 4. Nếu có upload ảnh đại diện mới → xóa ảnh cũ + cập nhật ảnh mới
    if (file) {
      if (userExist.anh_dai_dien) {
        const oldAvatarPath = path.join(
          process.cwd(),
          'public',
          'avatars',
          userExist.anh_dai_dien,
        );

        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      }
      dataToUpdate.anh_dai_dien = file.filename;
    }

    // 5. Cập nhật trong DB
    const updatedUser = await this.prisma.nguoi_dung.update({
      where: { nguoi_dung_id: Number(userId) },
      data: dataToUpdate,
      select: {
        nguoi_dung_id: true,
        email: true,
        ho_ten: true,
        tuoi: true,
        anh_dai_dien: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Cập nhật thông tin cá nhân thành công',
      data: updatedUser,
    };
  }
  // Lấy danh sách ảnh đã lưu của user hiện tại
  async getSavedImages(userId: number) {
    const getSaveImgaeById = await this.prisma.luu_anh.findMany({
      where: {
        nguoi_dung_id: userId,
        isDeleted: false,
      },
      include: {
        hinh_anh: {
          include: {
            nguoi_dung: {
              select: {
                nguoi_dung_id: true,
                ho_ten: true,
                anh_dai_dien: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return getSaveImgaeById;
  }

  async getInfo(user: number) {
    const userExist = await this.prisma.nguoi_dung.findFirst({
      where: {
        nguoi_dung_id: user,
        isDeleted: false,
      },
      select: {
        nguoi_dung_id: true,
        email: true,
        ho_ten: true,
        tuoi: true,
        anh_dai_dien: true,
        createdAt: true,
        updatedAt: true,
        // Không trả về mat_khau vì lý do bảo mật
      },
    });

    if (!userExist) {
      throw new BadRequestException('Không tìm thấy thông tin người dùng');
    }

    return userExist;
  }
}
