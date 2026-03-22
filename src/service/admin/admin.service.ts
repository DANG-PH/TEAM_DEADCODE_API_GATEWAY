import { Injectable, Inject, Logger } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import {
  GAME_PACKAGE_NAME,
  GAME_SERVICE_NAME,
  GameServiceClient,
} from 'proto/game.pb';
import { grpcCall } from 'src/HttpparseException/gRPC_to_Http';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  private gameGrpcService: GameServiceClient;

  constructor(
    @Inject(GAME_PACKAGE_NAME) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.gameGrpcService = this.client.getService<GameServiceClient>(GAME_SERVICE_NAME);
  }

  // ------------------------------------------------------------------ Level
  async handleAdminGetAllLevels() {
    return grpcCall(AdminService.name, this.gameGrpcService.adminGetAllLevels({}));
  }

  async handleAdminCreateLevel(data: { name: string; description: string; story: string; order: number }) {
    return grpcCall(AdminService.name, this.gameGrpcService.adminCreateLevel(data));
  }

  async handleAdminUpdateLevel(data: { id: number; name: string; description: string; story: string; order: number; is_active: boolean }) {
    return grpcCall(AdminService.name, this.gameGrpcService.adminUpdateLevel(data));
  }

  async handleAdminDeleteLevel(data: { id: number }) {
    return grpcCall(AdminService.name, this.gameGrpcService.adminDeleteLevel(data));
  }

  // ------------------------------------------------------------------ Challenge
  async handleAdminGetChallengesByLevel(data: { level_id: number }) {
    return grpcCall(AdminService.name, this.gameGrpcService.adminGetChallengesByLevel(data));
  }

  async handleAdminCreateChallenge(data: {
    level_id: number; title: string; description: string;
    type: string; starter_code: string; max_score: number; order: number;
  }) {
    return grpcCall(AdminService.name, this.gameGrpcService.adminCreateChallenge(data));
  }

  async handleAdminUpdateChallenge(data: {
    id: number; title: string; description: string;
    type: string; starter_code: string; max_score: number; order: number;
  }) {
    return grpcCall(AdminService.name, this.gameGrpcService.adminUpdateChallenge(data));
  }

  async handleAdminDeleteChallenge(data: { id: number }) {
    return grpcCall(AdminService.name, this.gameGrpcService.adminDeleteChallenge(data));
  }

  // ------------------------------------------------------------------ Hint
  async handleAdminGetHintsByChallenge(data: { challenge_id: number }) {
    return grpcCall(AdminService.name, this.gameGrpcService.adminGetHintsByChallenge(data));
  }

  async handleAdminCreateHint(data: { challenge_id: number; content: string; index: number }) {
    return grpcCall(AdminService.name, this.gameGrpcService.adminCreateHint(data));
  }

  async handleAdminDeleteHint(data: { id: number }) {
    return grpcCall(AdminService.name, this.gameGrpcService.adminDeleteHint(data));
  }
  // ------------------------------------------------------------------ Test Case
  async handleAdminGetTestCasesByChallenge(data: { challenge_id: number }) {
    return grpcCall(AdminService.name, this.gameGrpcService.adminGetTestCasesByChallenge(data));
  }

  async handleAdminCreateTestCase(data: { challenge_id: number; input: string; expected_output: string; order: number }) {
    return grpcCall(AdminService.name, this.gameGrpcService.adminCreateTestCase(data));
  }

  async handleAdminDeleteTestCase(data: { id: number }) {
    return grpcCall(AdminService.name, this.gameGrpcService.adminDeleteTestCase(data));
  }
}