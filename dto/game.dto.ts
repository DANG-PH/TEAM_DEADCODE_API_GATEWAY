import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Min, IsIn } from 'class-validator';

// ===== GET LEVELS =====
export class GetLevelsRequest {
  @ApiProperty({ example: 1, description: 'Auth ID để check unlock status' })
  @IsInt()
  @IsPositive()
  auth_id: number;
}

export class LevelSummaryDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Forest of Variables' })
  name: string;

  @ApiProperty({ example: 'Khám phá rừng và học về biến số' })
  description: string;

  @ApiProperty({ example: true, description: 'Màn này đã được mở khóa chưa' })
  is_unlocked: boolean;

  @ApiProperty({ example: false, description: 'Người chơi đã hoàn thành chưa' })
  is_completed: boolean;

  @ApiProperty({ example: 5, description: 'Số lượng thử thách trong màn' })
  challenge_count: number;
}

export class GetLevelsResponse {
  @ApiProperty({ type: [LevelSummaryDto] })
  levels: LevelSummaryDto[];
}

// ===== GET LEVEL DETAIL =====
export class GetLevelDetailRequest {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  level_id: number;

  @ApiProperty({ example: 1, description: 'Auth ID để check trạng thái từng challenge' })
  @IsInt()
  @IsPositive()
  auth_id: number;
}

export class ChallengeItemDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Gán biến số nguyên' })
  title: string;

  @ApiProperty({ example: 'variable', enum: ['variable', 'condition', 'loop'] })
  type: string;

  @ApiProperty({ example: false })
  is_completed: boolean;
}

export class GetLevelDetailResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Forest of Variables' })
  name: string;

  @ApiProperty({ example: 'Khám phá rừng và học về biến số' })
  description: string;

  @ApiProperty({ example: 'Ngày xưa có một khu rừng huyền bí...' })
  story: string;

  @ApiProperty({ example: true })
  is_unlocked: boolean;

  @ApiProperty({ type: [ChallengeItemDto] })
  challenges: ChallengeItemDto[];
}

// ===== GET CHALLENGE =====
export class GetChallengeRequest {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  challenge_id: number;
}

export class GetChallengeResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  level_id: number;

  @ApiProperty({ example: 'Gán biến số nguyên' })
  title: string;

  @ApiProperty({ example: 'Hãy khai báo biến x có giá trị là 10' })
  description: string;

  @ApiProperty({ example: 'variable', enum: ['variable', 'condition', 'loop'] })
  type: string;

  @ApiProperty({ example: 'x = ___', description: 'Code mẫu khởi đầu cho người chơi' })
  starter_code: string;

  @ApiProperty({ example: 100 })
  max_score: number;

  @ApiProperty({ example: 3, description: 'Số lượng hint có sẵn' })
  hint_count: number;
}

// ===== GET HINT =====
export class GetHintRequest {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  challenge_id: number;

  @ApiProperty({ example: 0, description: 'Chỉ số hint bắt đầu từ 0' })
  @IsInt()
  @Min(0)
  hint_index: number;
}

export class GetHintResponse {
  @ApiProperty({ example: 'Hãy thử dùng kiểu dữ liệu int' })
  hint: string;

  @ApiProperty({ example: false, description: 'Đây có phải hint cuối cùng không' })
  is_last: boolean;
}

// ===== SUBMIT ANSWER =====
export class SubmitAnswerRequest {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  auth_id: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  challenge_id: number;

  @ApiProperty({ example: 'x = 10', description: 'Code của người chơi' })
  @IsString()
  @IsNotEmpty({ message: 'Code không được để trống' })
  code: string;

  @ApiProperty({ example: 'python', enum: ['python', 'javascript'] })
  @IsString()
  @IsIn(['python', 'javascript'], { message: 'Ngôn ngữ phải là python hoặc javascript' })
  language: string;
}

export class TestResultDto {
  @ApiProperty({ example: 'x = 10' })
  input: string;

  @ApiProperty({ example: '10' })
  expected: string;

  @ApiProperty({ example: '10' })
  actual: string;

  @ApiProperty({ example: true })
  passed: boolean;
}

export class SubmitAnswerResponse {
  @ApiProperty({ example: true })
  passed: boolean;

  @ApiProperty({ example: 95 })
  score: number;

  @ApiProperty({ example: 'Đúng rồi! Bạn đã gán biến thành công.' })
  feedback: string;

  @ApiProperty({ example: 3, description: 'Số dòng code — dùng tính điểm thưởng Màn 3' })
  line_count: number;

  @ApiProperty({ example: 42, description: 'Thời gian thực thi (ms)' })
  execution_ms: number;

  @ApiProperty({ type: [TestResultDto] })
  test_results: TestResultDto[];
}

// ===== GET PROGRESS =====
export class GetProgressRequest {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  auth_id: number;
}

export class LevelProgressDto {
  @ApiProperty({ example: 1 })
  level_id: number;

  @ApiProperty({ example: 'Forest of Variables' })
  level_name: string;

  @ApiProperty({ example: true })
  is_completed: boolean;

  @ApiProperty({ example: 3 })
  challenges_done: number;

  @ApiProperty({ example: 5 })
  challenges_total: number;

  @ApiProperty({ example: 85 })
  score: number;

  @ApiProperty({ example: 120, description: 'Thời gian hoàn thành (giây)' })
  time_spent: number;
}

export class GetProgressResponse {
  @ApiProperty({ type: [LevelProgressDto] })
  levels: LevelProgressDto[];

  @ApiProperty({ example: 350 })
  total_score: number;

  @ApiProperty({ example: 2 })
  levels_completed: number;
}

// ===== START LEVEL =====
export class StartLevelRequest {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  auth_id: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  level_id: number;
}

export class StartLevelResponse {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: '2025-03-22T08:00:00.000Z', description: 'ISO8601' })
  started_at: string;
}

// ===== COMPLETE LEVEL =====
export class CompleteLevelRequest {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  auth_id: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  level_id: number;

  @ApiProperty({ example: 85 })
  @IsInt()
  @Min(0)
  score: number;

  @ApiProperty({ example: 120, description: 'Thời gian hoàn thành (giây)' })
  @IsInt()
  @Min(0)
  time_spent: number;

  @ApiProperty({ example: 'Forest of Variables', required: false }) 
  @IsOptional()
  @IsString()
  level_name?: string;
}

export class CompleteLevelResponse {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: true, description: 'Level tiếp theo đã được mở khóa' })
  next_level_unlocked: boolean;

  @ApiProperty({ example: 2, description: '0 nếu không có level tiếp theo' })
  next_level_id: number;
}

// ===== RUN CODE =====
export class RunCodeRequest {
  @ApiProperty({ example: 'print("Hello World")', description: 'Code cần chạy' })
  @IsString()
  @IsNotEmpty({ message: 'Code không được để trống' })
  code: string;

  @ApiProperty({ example: 'python', enum: ['python', 'javascript'] })
  @IsString()
  @IsIn(['python', 'javascript'], { message: 'Ngôn ngữ phải là python hoặc javascript' })
  language: string;

  @ApiProperty({ example: '', description: 'Stdin truyền vào chương trình', required: false })
  @IsOptional()
  @IsString()
  stdin?: string;
}

export class RunCodeResponse {
  @ApiProperty({ example: 'Hello World\n' })
  stdout: string;

  @ApiProperty({ example: '' })
  stderr: string;

  @ApiProperty({ example: 0, description: 'Exit code (0 = thành công)' })
  exit_code: number;

  @ApiProperty({ example: 38 })
  execution_ms: number;

  @ApiProperty({ example: false, description: 'True nếu vượt quá thời gian cho phép' })
  timed_out: boolean;
}

// ===== VALIDATE CODE =====
export class ValidateCodeRequest {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  challenge_id: number;

  @ApiProperty({ example: 'x = 10' })
  @IsString()
  @IsNotEmpty({ message: 'Code không được để trống' })
  code: string;

  @ApiProperty({ example: 'python', enum: ['python', 'javascript'] })
  @IsString()
  @IsIn(['python', 'javascript'], { message: 'Ngôn ngữ phải là python hoặc javascript' })
  language: string;
}

export class ValidateCodeResponse {
  @ApiProperty({ example: true })
  passed: boolean;

  @ApiProperty({ example: 'Tất cả test case đều pass!' })
  feedback: string;

  @ApiProperty({ example: 100 })
  score: number;

  @ApiProperty({ example: 2, description: 'Số dòng code — tính bonus Màn 3' })
  line_count: number;

  @ApiProperty({ type: [TestResultDto] })
  test_results: TestResultDto[];
}

// ===== ADMIN: LEVEL =====
export class AdminCreateLevelRequest {
  @ApiProperty({ example: 'Forest of Variables' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Khám phá rừng và học về biến số' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Ngày xưa có một khu rừng huyền bí...', required: false })
  @IsOptional()
  @IsString()
  story?: string;

  @ApiProperty({ example: 1, description: 'Thứ tự hiển thị' })
  @IsInt()
  @Min(1)
  order: number;
}

export class AdminCreateLevelResponse {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 1, description: 'ID của level vừa tạo' })
  id: number;
}

export class AdminUpdateLevelRequest {
  @ApiProperty({ example: 'Forest of Variables', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Khám phá rừng và học về biến số', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Ngày xưa có một khu rừng huyền bí...', required: false })
  @IsOptional()
  @IsString()
  story?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  order?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  is_active?: boolean;
}

export class AdminUpdateLevelResponse {
  @ApiProperty({ example: true })
  success: boolean;
}

export class AdminDeleteLevelResponse {
  @ApiProperty({ example: true })
  success: boolean;
}

export class AdminLevelItemDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Forest of Variables' })
  name: string;

  @ApiProperty({ example: 'Khám phá rừng và học về biến số' })
  description: string;

  @ApiProperty({ example: 'Ngày xưa có một khu rừng huyền bí...' })
  story: string;

  @ApiProperty({ example: 1 })
  order: number;

  @ApiProperty({ example: true })
  is_active: boolean;

  @ApiProperty({ example: 5 })
  challenge_count: number;
}

export class AdminGetAllLevelsResponse {
  @ApiProperty({ type: [AdminLevelItemDto] })
  levels: AdminLevelItemDto[];
}

// ===== ADMIN: CHALLENGE =====
export class AdminCreateChallengeRequest {
  @ApiProperty({ example: 1, description: 'ID của level chứa challenge này' })
  @IsInt()
  @IsPositive()
  level_id: number;

  @ApiProperty({ example: 'Gán biến số nguyên' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Hãy khai báo biến x có giá trị là 10' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'variable', enum: ['variable', 'condition', 'loop'] })
  @IsString()
  @IsIn(['variable', 'condition', 'loop'])
  type: string;

  @ApiProperty({ example: 'x = ___', required: false })
  @IsOptional()
  @IsString()
  starter_code?: string;

  @ApiProperty({ example: 100, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  max_score?: number;

  @ApiProperty({ example: 1, description: 'Thứ tự trong level' })
  @IsInt()
  @Min(1)
  order: number;
}

export class AdminCreateChallengeResponse {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 1 })
  id: number;
}

export class AdminUpdateChallengeRequest {
  @ApiProperty({ example: 'Gán biến số nguyên', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'Hãy khai báo biến x có giá trị là 10', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'variable', enum: ['variable', 'condition', 'loop'], required: false })
  @IsOptional()
  @IsString()
  @IsIn(['variable', 'condition', 'loop'])
  type?: string;

  @ApiProperty({ example: 'x = ___', required: false })
  @IsOptional()
  @IsString()
  starter_code?: string;

  @ApiProperty({ example: 100, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  max_score?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  order?: number;
}

export class AdminUpdateChallengeResponse {
  @ApiProperty({ example: true })
  success: boolean;
}

export class AdminDeleteChallengeResponse {
  @ApiProperty({ example: true })
  success: boolean;
}

export class AdminChallengeItemDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Gán biến số nguyên' })
  title: string;

  @ApiProperty({ example: 'variable' })
  type: string;

  @ApiProperty({ example: 'Hãy khai báo biến x có giá trị là 10' })
  description: string;

  @ApiProperty({ example: 'x = ___' })
  starter_code: string;

  @ApiProperty({ example: 100 })
  max_score: number;

  @ApiProperty({ example: 1 })
  order: number;

  @ApiProperty({ example: 3 })
  hint_count: number;
}

export class AdminGetChallengesByLevelResponse {
  @ApiProperty({ type: [AdminChallengeItemDto] })
  challenges: AdminChallengeItemDto[];
}

// ===== ADMIN: HINT =====
export class AdminCreateHintRequest {
  @ApiProperty({ example: 1, description: 'ID của challenge chứa hint này' })
  @IsInt()
  @IsPositive()
  challenge_id: number;

  @ApiProperty({ example: 'Hãy thử dùng kiểu dữ liệu int' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 0, description: 'Thứ tự gợi ý (0-based)' })
  @IsInt()
  @Min(0)
  index: number;
}

export class AdminCreateHintResponse {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 1 })
  id: number;
}

export class AdminDeleteHintResponse {
  @ApiProperty({ example: true })
  success: boolean;
}

export class AdminHintItemDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Hãy thử dùng kiểu dữ liệu int' })
  content: string;

  @ApiProperty({ example: 0 })
  index: number;
}

export class AdminGetHintsByChallengeResponse {
  @ApiProperty({ type: [AdminHintItemDto] })
  hints: AdminHintItemDto[];
}

// ===== ADMIN: TEST CASE =====
export class AdminCreateTestCaseRequest {
  @ApiProperty({ example: 1, description: 'ID của challenge' })
  @IsInt()
  @IsPositive()
  challenge_id: number;

  @IsOptional()          
  @IsString()
  input?: string;        

  @ApiProperty({ example: '25', description: 'Output mong đợi (sau khi trim)' })
  @IsString()
  @IsNotEmpty()
  expected_output: string;

  @ApiProperty({ example: 1, description: 'Thứ tự test case' })
  @IsInt()
  @Min(1)
  order: number;
}

export class AdminCreateTestCaseResponse {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 1 })
  id: number;
}

export class AdminDeleteTestCaseResponse {
  @ApiProperty({ example: true })
  success: boolean;
}

export class AdminTestCaseItemDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '5' })
  input: string;

  @ApiProperty({ example: '25' })
  expected_output: string;

  @ApiProperty({ example: 1 })
  order: number;
}

export class AdminGetTestCasesByChallengeResponse {
  @ApiProperty({ type: [AdminTestCaseItemDto] })
  test_cases: AdminTestCaseItemDto[];
}