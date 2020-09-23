import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { User } from './user.schema';
import { MailService } from 'src/mail/mail.service';
import JwtAuthGuard from './jwt.guard';
import JwtStrategy from './jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({}),
    TypegooseModule.forFeature([User]),
    MailService,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    MailService,
    JwtAuthGuard,
    JwtStrategy,
  ],
  exports: [
    JwtAuthGuard,
    JwtStrategy,
    PassportModule,
  ]
})
export class AuthModule { }
