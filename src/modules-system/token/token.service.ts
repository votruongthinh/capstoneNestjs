import { BadRequestException, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from 'src/common/constant/app.constant';
import { AccessTokenPayload, RefreshTokenPayload } from './token.dto';
@Injectable()
export class TokenService {
  createAccessToken(userId :number): string {
    if (!userId) {
      throw new BadRequestException('khong co userId de tao token');
    }
    const accessToken = jwt.sign(
      { userId: userId },
      ACCESS_TOKEN_SECRET as string,
      { expiresIn: '1m' },
    );
    return accessToken;
  }
  createRefreshToken(userId : number): string {
    if (!userId) {
      throw new BadRequestException('khong co userId de tao refreshtoken');
    }
    const refreshToken = jwt.sign(
      { userId: userId },
      REFRESH_TOKEN_SECRET as string,
      { expiresIn: '7d' },
    );
    return refreshToken;
  }
  verifyAccessToken(accessToken : string,option?: jwt.VerifyOptions) : AccessTokenPayload{
    const decode = jwt.verify(accessToken,ACCESS_TOKEN_SECRET as string ,option);
    return decode as AccessTokenPayload;
  }
  verifyRefreshToken(refreshToken: string,option?:jwt.VerifyOptions): RefreshTokenPayload{
    const decode = jwt.verify(refreshToken,REFRESH_TOKEN_SECRET as string ,option);
    return decode as RefreshTokenPayload;
  }
}
