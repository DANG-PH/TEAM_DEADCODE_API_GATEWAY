import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsUrl, Min } from 'class-validator';

// ===== GET PROFILE =====
export class GetProfileRequest {
}

export class GetProfileResponse {
  @ApiProperty({ example: 1 })
  auth_id: number;

  @ApiProperty({ example: 'dang123' })
  username: string;

  @ApiProperty({ example: 'Hải Đăng' })
  realname: string;

  @ApiProperty({ example: 'https://cdn.example.com/avatar/dang123.png', nullable: true })
  avatar: string;

  @ApiProperty({ example: 350, description: 'Tổng điểm tích lũy' })
  total_score: number;

  @ApiProperty({ example: 5, description: 'Xếp hạng hiện tại trên leaderboard' })
  rank: number;
}

// ===== UPDATE PROFILE =====
export class UpdateProfileRequest {
  @ApiProperty({
    example: 'https://cdn.example.com/avatar/dang123.png',
    description: 'URL avatar mới',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ example: 'Hải Đăng', description: 'Tên hiển thị mới', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Realname không được để trống nếu truyền vào' })
  realname?: string;
}

export class UpdateProfileResponse {
  @ApiProperty({ example: true })
  success: boolean;
}

// ===== ADD SCORE =====
export class AddScoreRequest {
  @ApiProperty({ example: 2, description: 'ID của level vừa hoàn thành' })
  @IsInt()
  @IsPositive()
  level_id: number;

  @ApiProperty({ example: 'Bridge of Logic', description: 'Tên level' })
  @IsString()
  @IsNotEmpty()
  level_name: string;

  @ApiProperty({ example: 85, description: 'Điểm đạt được' })
  @IsInt()
  @Min(0)
  score: number;

  @ApiProperty({ example: 120, description: 'Thời gian hoàn thành (giây)' })
  @IsInt()
  @Min(0)
  time_spent: number;
}

export class AddScoreResponse {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 435, description: 'Tổng điểm sau khi cộng' })
  total_score: number;
}

// ===== GET SCORES =====
export class GetScoresRequest {
}

export class ScoreEntryDto {
  @ApiProperty({ example: 1 })
  level_id: number;

  @ApiProperty({ example: 'Forest of Variables' })
  level_name: string;

  @ApiProperty({ example: 100 })
  score: number;

  @ApiProperty({ example: 95, description: 'Thời gian hoàn thành (giây)' })
  time_spent: number;

  @ApiProperty({ example: '2025-03-22T10:30:00.000Z', description: 'ISO8601' })
  completed_at: string;
}

export class GetScoresResponse {
  @ApiProperty({ type: [ScoreEntryDto] })
  scores: ScoreEntryDto[];
}

// ===== GET LEADERBOARD =====
export class GetLeaderboardRequest {
  @ApiProperty({ example: 10, description: 'Số lượng kết quả trả về', required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  limit?: number;

  @ApiProperty({ example: 0, description: 'Vị trí bắt đầu phân trang', required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;
}

export class LeaderboardEntryDto {
  @ApiProperty({ example: 1 })
  rank: number;

  @ApiProperty({ example: 1 })
  auth_id: number;

  @ApiProperty({ example: 'dang123' })
  username: string;

  @ApiProperty({ example: 'https://cdn.example.com/avatar/dang123.png', nullable: true })
  avatar: string;

  @ApiProperty({ example: 500 })
  total_score: number;
}

export class GetLeaderboardResponse {
  @ApiProperty({ type: [LeaderboardEntryDto] })
  entries: LeaderboardEntryDto[];

  @ApiProperty({ example: 42, description: 'Tổng số người chơi trong leaderboard' })
  total: number;
}

// ===== CREATE PROFILE (internal — gọi từ Auth service) =====
export class CreateProfileRequest {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  auth_id: number;

  @ApiProperty({ example: 'dang123' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'dangph.ptit@gmail.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Hải Đăng' })
  @IsString()
  @IsNotEmpty()
  realname: string;
}

export class CreateProfileResponse {
  @ApiProperty({ example: true })
  success: boolean;
}