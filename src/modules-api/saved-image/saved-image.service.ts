import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSavedImageDto } from './dto/create-saved-image.dto';
import { UpdateSavedImageDto } from './dto/update-saved-image.dto';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';

@Injectable()
export class SavedImageService {
  constructor(private prisma : PrismaService){}

  async saveImage(imageId: number, userId: number) {
    // 1. Kiểm tra ảnh có tồn tại không
    const imageExists = await this.prisma.hinh_anh.findUnique({
      where: {
        hinh_anh_id: imageId,
      },
    });
  
    console.log('Ảnh tìm thấy:', imageExists);
  
    if (!imageExists) {
      throw new BadRequestException('Ảnh không tồn tại');
    }
  
    // 2. Kiểm tra user đã lưu ảnh này chưa
    const existingSaved = await this.prisma.luu_anh.findFirst({
      where: {
        nguoi_dung_id: userId,
        hinh_id: imageId,
      },
    });
  
    console.log('Record lưu ảnh hiện tại:', existingSaved);
  
    // 3. Nếu đã có record
    if (existingSaved) {
      // Nếu trước đó đã soft delete thì restore lại
      if (existingSaved.isDeleted) {
        const restoredImage = await this.prisma.luu_anh.update({
          where: {
            nguoi_dung_id_hinh_id: {
              nguoi_dung_id: userId,
              hinh_id: imageId,
            },
          },
          data: {
            isDeleted: false,
            deletedAt: null,
            deletedBy: 0,
          },
        });
  
        return {
          message: 'Lưu ảnh thành công (khôi phục lại từ dữ liệu cũ)',
          data: restoredImage,
        };
      }
  
      throw new BadRequestException('Ảnh này đã được lưu rồi');
    }
  
    // 4. Nếu chưa có record -> tạo mới
    const savedImage = await this.prisma.luu_anh.create({
      data: {
        ngay_luu: new Date(),
        nguoi_dung: {
          connect: {
            nguoi_dung_id: userId,
          },
        },
        hinh_anh: {
          connect: {
            hinh_anh_id: imageId,
          },
        },
      },
    });
  
    console.log('Đã tạo bản ghi lưu ảnh:', savedImage);
  
    return {
      message: 'Lưu ảnh thành công',
      data: savedImage,
    };
  }


  async isSave(imageId: number, userId: number) {
    if (!userId) {
      return { isSaved: false };
    }
  
    console.log(`Đang kiểm tra: userId=${userId}, imageId=${imageId}`);
  
    const savedRecord = await this.prisma.luu_anh.findUnique({
      where: {
        nguoi_dung_id_hinh_id: {
          nguoi_dung_id: userId,
          hinh_id: imageId,
        }
      }
    });
  
    console.log('findUnique trả về:', savedRecord);
  
    return {
      isSaved: !!savedRecord && !savedRecord.isDeleted
    };
  }
  
}
