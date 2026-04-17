import { Controller, Post, Body, Res, Req, Get, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto } from './dto/login.dto';
import { registerDto } from './dto/register.dto';
import type { Request, Response } from 'express';
import { Public } from 'src/common/decorator/public.decorator';


@Controller('auth') //http://localhost:3060/auth/register or login
export class AuthController {
  constructor(private authService: AuthService) {}

  // api đăng kí người dùng
  @Post('register')
  @Public()
  async register(@Body() body: registerDto) {
    const result = await this.authService.register(body);
    return result;
  }

  
//api đăng nhập người dùng
  @Post('login')
  @Public()
  async login(
    @Body() body: loginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(body);
    res.cookie('accessToken', result.accessToken);
    res.cookie('refreshToken', result.refreshToken);
    return true;
  }


  @Post('refresh-token')
  @Public()
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true })
    res: Response,
  ) {
    const result = await this.authService.refreshToken(req);
    res.cookie('accessToken', result.accessToken);
    res.cookie('refreshToken', result.refreshToken);
    return true;
  }
  // @Get('get-info')
  // async getInfo(@User() user) {
  //   console.log('get-info', user);
  //   return true;
  // }

}
