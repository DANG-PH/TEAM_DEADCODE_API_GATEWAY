import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { PLAYER_PACKAGE_NAME } from 'proto/user.pb';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtStrategy } from 'src/security/JWT/jwt.strategy';
import { RolesGuard } from 'src/security/guard/role.guard';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: PLAYER_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: PLAYER_PACKAGE_NAME,
          protoPath: join(process.cwd(), 'proto/user.proto'),
          url: process.env.USER_URL,
          loader: {
                keepCase: true,
                objects: true,
                arrays: true,
          },
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService,JwtStrategy,RolesGuard],
  exports: [UserService]
})
export class UserModule {}
