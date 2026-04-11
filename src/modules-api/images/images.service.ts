import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { buildQueryPrisma } from 'src/common/helpers/build-query-prisma-helper';

@Injectable()
export class ImagesService {
  constructor(private prisma: PrismaService) {}

  // ✅ SỬA:
  // thêm tham số user để lấy thông tin người đăng nhập từ ProtectGuard
  async uploadImage(
    file: Express.Multer.File,
    createImageDto: CreateImageDto,
    user: any, // <-- lấy từ req.user
  ) {
    //1 Nếu user không upload ảnh thì báo lỗi luôn.
    if (!file) {
      throw new BadRequestException('Vui lòng chọn file ảnh');
    }

    // ✅ SỬA:
    // bỏ nguoi_dung_id ra khỏi body
    // vì user id phải lấy từ token / req.user
    const { ten_hinh, mo_ta } = createImageDto;

    // ✅ SỬA:
    // lấy id người dùng từ req.user (được Guard gắn vào request)
    const nguoi_dung_id = user.nguoi_dung_id;

    // ✅ GỢI Ý:
    // đoạn check user này thực ra có thể bỏ
    // vì ProtectGuard đã check user tồn tại rồi
    // nhưng giữ lại để code an toàn hơn và dễ hiểu flow
    const userExist = await this.prisma.nguoi_dung.findUnique({
      where: {
        nguoi_dung_id: Number(nguoi_dung_id),
      },
    });

    if (!userExist) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    //4 Tạo bản ghi ảnh trong DB
    const image = await this.prisma.hinh_anh.create({
      data: {
        // nếu frontend không gửi tên hình thì lấy tên file
        ten_hinh: ten_hinh || file.filename,

        // tên file đã upload
        duong_dan: file.filename,

        // nếu không có mô tả thì để rỗng
        mo_ta: mo_ta || '',

        // ✅ SỬA QUAN TRỌNG:
        // không lấy từ createImageDto.nguoi_dung_id nữa
        // mà lấy từ user đang đăng nhập
        nguoi_dung_id: Number(nguoi_dung_id),
      },
    });

    return {
      message: 'Upload ảnh thành công',
      data: image,
    };
  }

  async findAll(req: any) {
    const { index, page, pageSize, where, hasPagination } =
      buildQueryPrisma(req);

    const queryOptions: any = {
      where,
      orderBy: {
        hinh_anh_id: 'desc',
      },
      include: {
        nguoi_dung: {
          select: {
            nguoi_dung_id: true,
            ho_ten: true,
            email: true,
            anh_dai_dien: true,
          },
        },
      },
    };

    if (hasPagination) {
      queryOptions.skip = index;
      queryOptions.take = pageSize;
    }

    const [items, totalItem] = await Promise.all([
      this.prisma.hinh_anh.findMany(queryOptions),
      this.prisma.hinh_anh.count({
        where,
      }),
    ]);

    const totalPage = hasPagination ? Math.ceil(totalItem / pageSize) : 1;

    return {
      message: 'Lấy danh sách ảnh thành công',
      totalItem,
      totalPage,
      page: hasPagination ? page : null,
      pageSize: hasPagination ? pageSize : totalItem,
      items,
    };
  }

  async findByName(req: any) {
    let { ten_hinh, page, pageSize } = req.query;

    // =========================
    // 1) XỬ LÝ PAGE / PAGESIZE
    // =========================
    page = Number(page);
    pageSize = Number(pageSize);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(pageSize) || pageSize < 1) pageSize = 3;

    const index = (page - 1) * pageSize;

    // =========================
    // 2) TẠO WHERE SEARCH
    // =========================
    const where = {
      ten_hinh: {
        contains: ten_hinh || '',
      },
      isDeleted: false,
    };

    const [items, totalItem] = await Promise.all([
      this.prisma.hinh_anh.findMany({
        where,
        skip: index,
        take: pageSize,
        orderBy: {
          hinh_anh_id: 'desc',
        },
        include: {
          nguoi_dung: {
            select: {
              nguoi_dung_id: true,
              ho_ten: true,
              email: true,
              anh_dai_dien: true,
            },
          },
        },
      }),
      this.prisma.hinh_anh.count({ where }),
    ]);

    return {
      message: 'Tìm kiếm ảnh theo tên thành công',
      totalItem,
      totalPage: Math.ceil(totalItem / pageSize),
      page,
      pageSize,
      keyword: ten_hinh || '',
      items,
    };
  }

  async getImageDetail(id: number) {
    const getDetail = await this.prisma.hinh_anh.findFirst({
      where: {
        hinh_anh_id: id,
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
    });
    return getDetail;
  }

  async deleteImage(id: number, user: number) {
    // Nhận userId là number
    const image = await this.prisma.hinh_anh.findFirst({
      where: {
        hinh_anh_id: id,
        isDeleted: false,
      },
    });

    if (!image) {
      throw new BadRequestException(`Không tìm thấy ảnh với id = ${image}`);
    }

    if (image.nguoi_dung_id !== user) {
      throw new ForbiddenException('Bạn không có quyền xóa ảnh này');
    }

    // Soft Delete
    const result = await this.prisma.hinh_anh.update({
      where: { hinh_anh_id: id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: user,
      },
    });

    return {
      message: 'Xóa ảnh thành công',
      imageId: result.hinh_anh_id,
      isDeleted: true,
      deletedAt: result.deletedAt,
    };
  }
  async restore(id: number, user: number) {
    const image = await this.prisma.hinh_anh.findFirst({
      where: {
        hinh_anh_id: id,
        nguoi_dung_id: user,
        isDeleted: true,
      },
    });
    if (!image) {
      throw new BadRequestException(`Không tìm thấy ảnh đã xóa với id = ${id}`);
    }
    const restored = await this.prisma.hinh_anh.update({
      where: { hinh_anh_id: id },
      data: {
        isDeleted: false,
        deletedAt: null,
        deletedBy: 0,
      },
    });

    return {
      message: 'Phục hồi ảnh thành công',
      image: {
        hinh_anh_id: restored.hinh_anh_id,
        ten_hinh: restored.ten_hinh,
        isDeleted: restored.isDeleted,
      },
    };
  }
  async deleteHard(id: number, user: number) {
    const image = await this.prisma.hinh_anh.findUnique({
      where: {
        hinh_anh_id: id,
        isDeleted: false,
      },
    });
    if (!image) {
      throw new BadRequestException(`không tìm thấy ảnh với id = ${id}`);
    }
    if (image.nguoi_dung_id !== user) {
      throw new ForbiddenException('Bạn không có quyền xóa ảnh này');
    }
    const result = await this.prisma.hinh_anh.delete({
      where: { hinh_anh_id: id },
    });
  }
}
