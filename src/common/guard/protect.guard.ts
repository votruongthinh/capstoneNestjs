import { TokenExpiredError } from 'jsonwebtoken';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/modules-system/prisma/prisma.service';
import { TokenService } from 'src/modules-system/token/token.service';
import { IS_PUBLIC_KEY } from '../decorator/public.decorator';
import { AccessTokenPayload } from 'src/modules-system/token/token.dto';
@Injectable()
export class ProtectGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private prisma: PrismaService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isPubic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      console.log({ isPubic });
      if (isPubic) {
        return true;
      }

      const req = context.switchToHttp().getRequest();

      const { accessToken } = req.cookies;
      if (!accessToken) {
        throw new UnauthorizedException('không có token');
      }
      //kiển tra token có hợp lệ không
      const decode : AccessTokenPayload = await this.tokenService.verifyAccessToken(accessToken);
      const userExist = await this.prisma.nguoi_dung.findUnique({
        where: {
          nguoi_dung_id: decode.userId,
        },
      });
      if (!userExist) {
        throw new UnauthorizedException('Người dùng không tồn tại');
      }
      req.user = userExist;
      console.log('ProtectGuard:', { decode, userExist });
      return true;
    } catch (error) {
      console.log({ error });
      switch (error.constructor) {
        case TokenExpiredError:
          throw new ForbiddenException(error.message);

        default:
          throw new UnauthorizedException();
      }
    }
  }
}
