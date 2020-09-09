import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { User } from './user.schema';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    TypegooseModule.forFeature([User]),
    MailService,
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService]
})
export class AuthModule { }
