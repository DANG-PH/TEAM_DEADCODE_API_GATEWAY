import {
  Controller, Get, Post, Patch,
  Body, Req, Inject, UseGuards, Param, Query,
  HttpException, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import type { Request } from 'express';
import { UserService } from './user.service';
import {
  UpdateProfileRequest,
  GetLeaderboardRequest,
} from 'dto/user.dto';
import { JwtAuthGuard } from 'src/security/JWT/jwt-auth.guard';

@Controller('api/user')
@ApiTags('Api User')
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // ------------------------------------------------------------------ Profile

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Lấy thông tin profile của bản thân' })
  async getProfile(@Req() req: any) {
    const auth_id = req.user.userId;
    if (!auth_id) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const cacheKey = `profile_${auth_id}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const result = await this.userService.handleGetProfile({ auth_id });
    await this.cacheManager.set(cacheKey, result, 60 * 1000); // cache 60s
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @ApiOperation({ summary: 'Cập nhật avatar hoặc tên hiển thị' })
  @ApiBody({ type: UpdateProfileRequest })
  async updateProfile(@Body() body: UpdateProfileRequest, @Req() req: any) {
    const auth_id = req.user.userId;
    if (!auth_id) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const result = await this.userService.handleUpdateProfile({
      auth_id,
      avatar:   body.avatar   ?? '',
      realname: body.realname ?? '',
    });

    // invalidate cache profile sau khi update
    await this.cacheManager.del(`profile_${auth_id}`);
    return result;
  }

  // ------------------------------------------------------------------ Scores

  @UseGuards(JwtAuthGuard)
  @Get('scores')
  @ApiOperation({ summary: 'Lấy lịch sử điểm của bản thân' })
  async getScores(@Req() req: any) {
    const auth_id = req.user.userId;
    if (!auth_id) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    return this.userService.handleGetScores({ auth_id });
  }

  // ------------------------------------------------------------------ Leaderboard

  @Get('leaderboard')
  @ApiOperation({ summary: 'Lấy bảng xếp hạng' })
  async getLeaderboard(
    @Query('limit')  limit  = 10,
    @Query('offset') offset = 0,
  ) {
    const cacheKey = `leaderboard_${limit}_${offset}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const result = await this.userService.handleGetLeaderboard({
      limit:  Number(limit),
      offset: Number(offset),
    });

    await this.cacheManager.set(cacheKey, result, 30 * 1000); // cache 30s
    return result;
  }
}