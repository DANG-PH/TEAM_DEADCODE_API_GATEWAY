import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/security/decorators/role.decorator';
import { JwtAuthGuard } from 'src/security/JWT/jwt-auth.guard';
import { RolesGuard } from 'src/security/guard/role.guard';
import { Role } from 'src/enums/role.enum';
import { AdminService } from './admin.service';
import {
  AdminCreateLevelRequest,
  AdminUpdateLevelRequest,
  AdminCreateChallengeRequest,
  AdminUpdateChallengeRequest,
  AdminCreateHintRequest,
  AdminCreateTestCaseRequest,
} from 'dto/game.dto';

@Controller('api/admin')
@ApiTags('Api Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ------------------------------------------------------------------ Level

  @Get('levels')
  @ApiOperation({ summary: '[Admin] Lấy tất cả level' })
  getAllLevels() {
    return this.adminService.handleAdminGetAllLevels();
  }

  @Post('levels')
  @ApiOperation({ summary: '[Admin] Tạo level mới' })
  @ApiBody({ type: AdminCreateLevelRequest })
  createLevel(@Body() body: AdminCreateLevelRequest) {
    return this.adminService.handleAdminCreateLevel({
      name:        body.name,
      description: body.description,
      story:       body.story       ?? '',
      order:       body.order       ?? 1,
    });
  }

  @Patch('levels/:id')
  @ApiOperation({ summary: '[Admin] Cập nhật level' })
  @ApiBody({ type: AdminUpdateLevelRequest })
  updateLevel(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AdminUpdateLevelRequest,
  ) {
    return this.adminService.handleAdminUpdateLevel({
      id,
      name:        body.name        ?? '',
      description: body.description ?? '',
      story:       body.story       ?? '',
      order:       body.order       ?? 0,
      is_active:   body.is_active   ?? true,
    });
  }

  @Delete('levels/:id')
  @ApiOperation({ summary: '[Admin] Xóa level' })
  deleteLevel(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.handleAdminDeleteLevel({ id });
  }

  // ------------------------------------------------------------------ Challenge

  @Get('levels/:levelId/challenges')
  @ApiOperation({ summary: '[Admin] Lấy danh sách challenge theo level' })
  getChallengesByLevel(@Param('levelId', ParseIntPipe) levelId: number) {
    return this.adminService.handleAdminGetChallengesByLevel({ level_id: levelId });
  }

  @Post('challenges')
  @ApiOperation({ summary: '[Admin] Tạo challenge mới' })
  @ApiBody({ type: AdminCreateChallengeRequest })
  createChallenge(@Body() body: AdminCreateChallengeRequest) {
    return this.adminService.handleAdminCreateChallenge({
      level_id:     body.level_id,
      title:        body.title,
      description:  body.description,
      type:         body.type,
      starter_code: body.starter_code ?? '',
      max_score:    body.max_score    ?? 100,
      order:        body.order        ?? 1,
    });
  }

  @Patch('challenges/:id')
  @ApiOperation({ summary: '[Admin] Cập nhật challenge' })
  @ApiBody({ type: AdminUpdateChallengeRequest })
  updateChallenge(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AdminUpdateChallengeRequest,
  ) {
    return this.adminService.handleAdminUpdateChallenge({
      id,
      title:        body.title        ?? '',
      description:  body.description  ?? '',
      type:         body.type         ?? '',
      starter_code: body.starter_code ?? '',
      max_score:    body.max_score    ?? 0,
      order:        body.order        ?? 0,
    });
  }

  @Delete('challenges/:id')
  @ApiOperation({ summary: '[Admin] Xóa challenge' })
  deleteChallenge(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.handleAdminDeleteChallenge({ id });
  }

  // ------------------------------------------------------------------ Hint

  @Get('challenges/:challengeId/hints')
  @ApiOperation({ summary: '[Admin] Lấy danh sách hint theo challenge' })
  getHintsByChallenge(@Param('challengeId', ParseIntPipe) challengeId: number) {
    return this.adminService.handleAdminGetHintsByChallenge({ challenge_id: challengeId });
  }

  @Post('hints')
  @ApiOperation({ summary: '[Admin] Tạo hint mới' })
  @ApiBody({ type: AdminCreateHintRequest })
  createHint(@Body() body: AdminCreateHintRequest) {
    return this.adminService.handleAdminCreateHint({
      challenge_id: body.challenge_id,
      content:      body.content,
      index:        body.index,
    });
  }

  @Delete('hints/:id')
  @ApiOperation({ summary: '[Admin] Xóa hint' })
  deleteHint(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.handleAdminDeleteHint({ id });
  }

  // ------------------------------------------------------------------ Test Case

  @Get('challenges/:challengeId/test-cases')
  @ApiOperation({ summary: '[Admin] Lấy danh sách test case theo challenge' })
  getTestCasesByChallenge(@Param('challengeId', ParseIntPipe) challengeId: number) {
    return this.adminService.handleAdminGetTestCasesByChallenge({ challenge_id: challengeId });
  }

  @Post('test-cases')
  @ApiOperation({ summary: '[Admin] Tạo test case mới' })
  @ApiBody({ type: AdminCreateTestCaseRequest })
  createTestCase(@Body() body: AdminCreateTestCaseRequest) {
    return this.adminService.handleAdminCreateTestCase({
      challenge_id:    body.challenge_id,
      input:           body.input ?? "",
      expected_output: body.expected_output,
      order:           body.order ?? 1,
    });
  }

  @Delete('test-cases/:id')
  @ApiOperation({ summary: '[Admin] Xóa test case' })
  deleteTestCase(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.handleAdminDeleteTestCase({ id });
  }
}