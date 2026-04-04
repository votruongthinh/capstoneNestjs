import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto } from './dto/login.dto';
import { registerDto } from './dto/register.dto';
import type { Request, Response } from 'express';

@Controller('auth') //http://localhost:3060/auth/register or login
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: registerDto) {
    const result = await this.authService.register(body);
    return result;
  }

  @Post('login')
  async login(
    @Body() body: loginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(body);
    res.cookie('accessToken', result.accessToken);
    res.cookie('refreshToken', result.refreshToken);
    return true;
  }
}
