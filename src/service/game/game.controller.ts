import {
  Controller, Get, Post,
  Body, Req, Inject, Param, Query,
  HttpException, HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { GameService } from './game.service';
import { UserService } from '../user/user.service';
import {
  SubmitAnswerRequest,
  StartLevelRequest,
  CompleteLevelRequest,
  RunCodeRequest,
  ValidateCodeRequest,
} from 'dto/game.dto';
import { JwtAuthGuard } from 'src/security/JWT/jwt-auth.guard';

@Controller('api/game')
@ApiTags('Api Game')
@ApiBearerAuth()
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // ------------------------------------------------------------------ Level

  @UseGuards(JwtAuthGuard)
  @Get('levels')
  @ApiOperation({ summary: 'Lấy danh sách tất cả màn chơi' })
  async getLevels(@Req() req: any) {
    const auth_id = req.user.userId;
    if (!auth_id) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const cacheKey = `levels_${auth_id}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const result = await this.gameService.handleGetLevels({ auth_id });
    await this.cacheManager.set(cacheKey, result, 30 * 1000);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('levels/:id')
  @ApiOperation({ summary: 'Lấy chi tiết màn chơi và danh sách thử thách' })
  async getLevelDetail(@Param('id') id: string, @Req() req: any) {
    const auth_id = req.user.userId;
    if (!auth_id) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    return this.gameService.handleGetLevelDetail({
      level_id: Number(id),
      auth_id,
    });
  }

  // ------------------------------------------------------------------ Challenge

  @UseGuards(JwtAuthGuard)
  @Get('challenges/:id')
  @ApiOperation({ summary: 'Lấy nội dung thử thách' })
  async getChallenge(@Param('id') id: string, @Req() req: any) {
    if (!req.user.userId) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const cacheKey = `challenge_${id}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const result = await this.gameService.handleGetChallenge({ challenge_id: Number(id) });
    await this.cacheManager.set(cacheKey, result, 5 * 60 * 1000); // cache 5 phút vì data tĩnh
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('challenges/:id/hint')
  @ApiOperation({ summary: 'Lấy gợi ý theo từng bước' })
  async getHint(
    @Param('id') id: string,
    @Query('index') index = 0,
    @Req() req: any,
  ) {
    if (!req.user.userId) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    return this.gameService.handleGetHint({
      challenge_id: Number(id),
      hint_index:   Number(index),
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('challenges/:id/submit')
  @ApiOperation({ summary: 'Nộp đáp án cho thử thách' })
  @ApiBody({ type: SubmitAnswerRequest })
  async submitAnswer(
    @Param('id') id: string,
    @Body() body: SubmitAnswerRequest,
    @Req() req: any,
  ) {
    const auth_id = req.user.userId;
    if (!auth_id) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const result = await this.gameService.handleSubmitAnswer({
      ...body,
      auth_id,
      challenge_id: Number(id),
    });

    // invalidate cache levels sau khi submit thành công (unlock status có thể thay đổi)
    if (result.passed) {
      await this.cacheManager.del(`levels_${auth_id}`);
    }

    return result;
  }

  // ------------------------------------------------------------------ Progress

  @UseGuards(JwtAuthGuard)
  @Get('progress')
  @ApiOperation({ summary: 'Lấy tiến trình của bản thân' })
  async getProgress(@Req() req: any) {
    const auth_id = req.user.userId;
    if (!auth_id) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    return this.gameService.handleGetProgress({ auth_id });
  }

  @UseGuards(JwtAuthGuard)
  @Post('levels/:id/start')
  @ApiOperation({ summary: 'Bắt đầu màn chơi — tạo progress record' })
  async startLevel(@Param('id') id: string, @Req() req: any) {
    const auth_id = req.user.userId;
    if (!auth_id) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    return this.gameService.handleStartLevel({
      auth_id,
      level_id: Number(id),
    });
  }


  @UseGuards(JwtAuthGuard)
  @Post('levels/:id/complete')
  @ApiOperation({ summary: 'Hoàn thành màn chơi — ghi điểm và mở màn tiếp theo' })
  @ApiBody({ type: CompleteLevelRequest })
  async completeLevel(
    @Param('id') id: string,
    @Body() body: CompleteLevelRequest,
    @Req() req: any,
  ) {
    const auth_id = req.user.userId;
    if (!auth_id) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    // 1. báo Game service mark completed
    const gameResult = await this.gameService.handleCompleteLevel({
        auth_id,
        level_id:   Number(id),
        score:      body.score      ?? 0,
        time_spent: body.time_spent ?? 0,
        level_name: body.level_name ?? '',
    });
    // 2. ghi điểm sang Player service
    if (gameResult.success) {
      await this.userService.handleAddScore({
        auth_id,
        level_id:   Number(id),
        level_name: body.level_name ?? `Level ${id}`,
        score:      body.score,
        time_spent: body.time_spent,
      });

      // invalidate cache liên quan
      await this.cacheManager.del(`levels_${auth_id}`);
      await this.cacheManager.del(`profile_${auth_id}`);
    }

    return gameResult;
  }

  // ------------------------------------------------------------------ Code execution

  @UseGuards(JwtAuthGuard)
  @Post('code/run')
  @ApiOperation({ summary: 'Chạy code trong sandbox — không lưu kết quả' })
  @ApiBody({ type: RunCodeRequest })
  async runCode(@Body() body: RunCodeRequest, @Req() req: any) {
    console.log('Gateway runCode called', body) 
    if (!req.user.userId) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
console.log('Gateway runCode called', body) 
    return this.gameService.handleRunCode({
    ...body,
    stdin: body.stdin ?? '',
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('code/validate')
  @ApiOperation({ summary: 'Validate code theo test cases — không lưu kết quả' })
  @ApiBody({ type: ValidateCodeRequest })
  async validateCode(@Body() body: ValidateCodeRequest, @Req() req: any) {
    if (!req.user.userId) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    return this.gameService.handleValidateCode(body);
  }
}