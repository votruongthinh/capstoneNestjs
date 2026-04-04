import { BadRequestException, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from 'src/common/constant/app.constant';
@Injectable()
export class TokenService {
  createAccessToken(userId) {
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
  createRefreshToken(userId) {
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
  verifyAccessToken(accessToken,option?: jwt.VerifyOptions){
    const decode = jwt.verify(accessToken,ACCESS_TOKEN_SECRET as string ,option);
    return decode;
  }
  verifyRefreshToken(refreshToken,option?:jwt.VerifyOptions){
    const decode = jwt.verify(refreshToken,REFRESH_TOKEN_SECRET as string ,option);
    return decode;
  }
}
