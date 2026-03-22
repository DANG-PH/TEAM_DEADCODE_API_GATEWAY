import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './service/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './service/user/user.module';
import { NestModule,MiddlewareConsumer } from '@nestjs/common';
import { RateLimitMiddleware } from './security/rate_limit/rate_limit.middleware';
import { RedisModule } from './redis/redis.module';
import { GameModule } from './service/game/game.module';
import { AdminModule } from './service/admin/admin.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,           
      envFilePath: '.env',     
    }),
    AuthModule,
    UserModule,
    RedisModule,
    GameModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimitMiddleware).forRoutes('*');
  }
}

