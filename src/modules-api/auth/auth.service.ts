import { BadRequestException, Injectable } from '@nestjs/common';
import { loginDto } from './dto/login.dto';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { registerDto } from './dto/register.dto';
import { TokenService } from 'src/modules-system/token/token.service';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
  ) {}
  async register(body: registerDto) {
    //1
    const { email, mat_khau, ho_ten, tuoi } = body;

    //2 kiểm tra email có tồn tại trong db hay không
    const userExist = await this.prisma.nguoi_dung.findUnique({
      where: {
        email: email,
      },
    });

    //3 nếu người dùng tồn tại thì từ chối
    if (userExist) {
      throw new BadRequestException(
        'Người dùng đã tồn tại, vui lòng đăng nhập',
      );
    }
    //4 mã hóa mật khẩu trước khi lưu vào db
    const passwordHash = bcrypt.hashSync(mat_khau, 10);

    //5 tạo mới người dùng vào db
    const userNew = await this.prisma.nguoi_dung.create({
      data: {
        email: email,
        mat_khau: passwordHash, // lưu mật khẩu đã được mã hóa vào db
        ho_ten: ho_ten,
        tuoi: tuoi,
      },
    });

    //log kiểm tra
    console.log({ email, mat_khau, ho_ten, userExist, userNew });
    return true;
  }
  async login(body: loginDto) {
    const { email, mat_khau, token } = body;

    const userExist = await this.prisma.nguoi_dung.findUnique({
      where: {
        email: email,
      },
      omit: {
        mat_khau: false,
      },
    });
    if (!userExist) {
      throw new BadRequestException(
        'Người dùng không tồn tại, vui lòng đăng ký',
      );
    }
    const isPassword = bcrypt.compareSync(mat_khau, userExist.mat_khau);
    //console.log({body});
    if (!isPassword) {
      throw new BadRequestException(
        'Mật khẩu không chính xác, vui lòng thử lại',
      );
    }
    const accessToken = this.tokenService.createAccessToken(
      userExist.nguoi_dung_id,
    );
    const refreshToken = this.tokenService.createRefreshToken(
      userExist.nguoi_dung_id,
    );
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
