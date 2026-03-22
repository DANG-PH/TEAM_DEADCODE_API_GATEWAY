import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GAME_PACKAGE_NAME } from 'proto/game.pb';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from 'src/security/JWT/jwt.strategy';
import { RolesGuard } from 'src/security/guard/role.guard';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: GAME_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: GAME_PACKAGE_NAME,
          protoPath: join(process.cwd(), 'proto/game.proto'),
          url: process.env.GAME_URL,
          loader: {
            keepCase: true, 
            objects: true,
            arrays: true,
          },
        },
      },
    ]),
    UserModule,
  ],
  controllers: [GameController],
  providers: [GameService, JwtStrategy, RolesGuard],
})
export class GameModule {}