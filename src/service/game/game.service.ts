import { Injectable, Inject, Logger } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import {
  GAME_PACKAGE_NAME,
  GAME_SERVICE_NAME,
  GameServiceClient,
  GetLevelsRequest,
  GetLevelDetailRequest,
  GetChallengeRequest,
  GetHintRequest,
  SubmitAnswerRequest,
  GetProgressRequest,
  StartLevelRequest,
  CompleteLevelRequest,
  RunCodeRequest,
  ValidateCodeRequest,
} from 'proto/game.pb';
import { grpcCall } from 'src/HttpparseException/gRPC_to_Http';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);
  private gameGrpcService: GameServiceClient;

  constructor(
    @Inject(GAME_PACKAGE_NAME) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.gameGrpcService = this.client.getService<GameServiceClient>(GAME_SERVICE_NAME);
  }

  async handleGetLevels(req: GetLevelsRequest) {
    return grpcCall(GameService.name, this.gameGrpcService.getLevels(req));
  }

  async handleGetLevelDetail(req: GetLevelDetailRequest) {
    return grpcCall(GameService.name, this.gameGrpcService.getLevelDetail(req));
  }

  async handleGetChallenge(req: GetChallengeRequest) {
    return grpcCall(GameService.name, this.gameGrpcService.getChallenge(req));
  }

  async handleGetHint(req: GetHintRequest) {
    return grpcCall(GameService.name, this.gameGrpcService.getHint(req));
  }

  async handleSubmitAnswer(req: SubmitAnswerRequest) {
    return grpcCall(GameService.name, this.gameGrpcService.submitAnswer(req));
  }

  async handleGetProgress(req: GetProgressRequest) {
    return grpcCall(GameService.name, this.gameGrpcService.getProgress(req));
  }

  async handleStartLevel(req: StartLevelRequest) {
    return grpcCall(GameService.name, this.gameGrpcService.startLevel(req));
  }

  async handleCompleteLevel(req: CompleteLevelRequest) {
    return grpcCall(GameService.name, this.gameGrpcService.completeLevel(req));
  }

  async handleRunCode(req: RunCodeRequest) {
    return grpcCall(GameService.name, this.gameGrpcService.runCode(req));
  }

  async handleValidateCode(req: ValidateCodeRequest) {
    return grpcCall(GameService.name, this.gameGrpcService.validateCode(req));
  }
}