import { Controller, Post, Body, Res, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto } from './dto/login.dto';
import { registerDto } from './dto/register.dto';
import type { Request, Response } from 'express';
import { Public } from 'src/common/decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  @Public()
  getAuthInfo() {
    return {
      message: 'Auth API is running',
      endpoints: [
        'POST /api/auth/register',
        'POST /api/auth/login',
        'POST /api/auth/refresh-token',
      ],
    };
  }

  @Post('register')
  @Public()
  async register(@Body() body: registerDto) {
    const result = await this.authService.register(body);
    return result;
  }

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
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.refreshToken(req);
    res.cookie('accessToken', result.accessToken);
    res.cookie('refreshToken', result.refreshToken);
    return true;
  }
}
