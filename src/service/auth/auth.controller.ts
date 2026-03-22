import { Controller, Post, Body, UseGuards, Patch, Req, Inject, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { LoginRequest, RegisterRequest, RefreshRequest, VerifyOtpRequestDto} from 'dto/auth.dto';
import { AuthService } from './auth.service';
import { UserService } from 'src/service/user/user.service';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Request } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';

@Controller('api/auth')
@ApiTags('Api Auth') 
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản user' })
  @ApiBody({ type:  RegisterRequest })
  async register(@Body() body: RegisterRequest, @Req() req: any) {
    const ip = req.headers['x-forwarded-for'] || req.ip;
    const key = `register_rate_limit_${ip}`;
    const limit = 10;  
    const ttl = 60;   

    let count = (await this.cacheManager.get<number>(key)) || 0;
    count++;

    if (count > limit) {
      throw new HttpException(
        'Quá nhiều lần đăng ký, vui lòng thử lại sau ít phút.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    await this.cacheManager.set(key, count, ttl * 1000);

    const authResult = await this.authService.handleRegister(body); 
    if (!authResult.success) {
      return { success: false, message: 'Đăng ký auth thất bại' };
    }
    console.log(authResult)
    const userRequest = {
      id: authResult.auth_id, 
    };

    const userResult = await this.userService.handleCreateProfile({
      auth_id:  authResult.auth_id,
      username: body.username,
      email:    body.email,
      realname: body.realname,
    });

    console.log(userRequest)

    return {
      auth: authResult,
      user: userResult,
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Bước 1: Đăng nhập tài khoản user' })
  @ApiBody({ type:  LoginRequest })
  async login(@Body() body: LoginRequest, @Req() req: Request) {
    const ip = req.ip;
    const key = `login_rate_limit_${ip}`;
    const limit = 6; 
    const ttl = 60;   

    let count = (await this.cacheManager.get<number>(key)) || 0;
    count++;

    if (count > limit) {
      throw new HttpException(
        'Bạn đăng nhập quá nhiều lần, vui lòng thử lại sau 1 phút.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    await this.cacheManager.set(key, count, ttl * 1000);
    
    return this.authService.handleLogin(body);
  }
  
  @Post('verify-otp')
  @ApiOperation({ summary: 'Bước 2: Xác thực OTP và nhận access + refresh token' })
  @ApiBody({ type: VerifyOtpRequestDto })
  async verifyOtp(@Body() body: VerifyOtpRequestDto) {
    const result = await this.authService.handleVerifyOtp(body);
    if (result.access_token) {
        const username = Buffer.from(body.sessionId, 'base64').toString('ascii');
        let onlineUsers = await this.cacheManager.get<string[]>('online_users') || [];
        let timeConLai = await this.cacheManager.ttl('online_users'); // trả về time hết hạn
        if (timeConLai) timeConLai = timeConLai-Date.now();
        else timeConLai = 60 * 1000;
        if (!onlineUsers.includes(username)) onlineUsers.push(username);
        await this.cacheManager.set('online_users', onlineUsers, timeConLai);
    }
    return result;
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Làm mới Access Token bằng Refresh Token' })
  @ApiBody({ type: RefreshRequest })
  async refresh(@Body() body: RefreshRequest) {
    return this.authService.handleRefresh(body);
  }
}