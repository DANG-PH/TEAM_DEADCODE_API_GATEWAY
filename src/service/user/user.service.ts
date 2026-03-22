import { Injectable, Inject, Logger } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import {
  PLAYER_PACKAGE_NAME,
  PLAYER_SERVICE_NAME,
  PlayerServiceClient,
  CreateProfileRequest,
  GetProfileRequest,
  UpdateProfileRequest,
  GetLeaderboardRequest,
  AddScoreRequest,
  GetScoresRequest,
} from 'proto/user.pb';
import { grpcCall } from 'src/HttpparseException/gRPC_to_Http';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private playerGrpcService: PlayerServiceClient;

  constructor(
    @Inject(PLAYER_PACKAGE_NAME) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.playerGrpcService = this.client.getService<PlayerServiceClient>(PLAYER_SERVICE_NAME);
  }

  async handleCreateProfile(req: CreateProfileRequest) {
    return grpcCall(UserService.name, this.playerGrpcService.createProfile(req));
  }

  async handleGetProfile(req: GetProfileRequest) {
    return grpcCall(UserService.name, this.playerGrpcService.getProfile(req));
  }

  async handleUpdateProfile(req: UpdateProfileRequest) {
    const payload = {
      auth_id:  req.auth_id,
      avatar:   req.avatar   ?? '',
      realname: req.realname ?? '',
    };
    return grpcCall(UserService.name, this.playerGrpcService.updateProfile(payload));
  }

  async handleGetLeaderboard(req: GetLeaderboardRequest) {
    return grpcCall(UserService.name, this.playerGrpcService.getLeaderboard(req));
  }

  async handleAddScore(req: AddScoreRequest) {
    return grpcCall(UserService.name, this.playerGrpcService.addScore(req));
  }

  async handleGetScores(req: GetScoresRequest) {
    return grpcCall(UserService.name, this.playerGrpcService.getScores(req));
  }
}