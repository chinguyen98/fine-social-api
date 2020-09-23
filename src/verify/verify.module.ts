import { Module } from '@nestjs/common';
import { VerifyService } from './verify.service';
import { VerifyController } from './verify.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypegooseModule } from 'nestjs-typegoose';

import { User } from 'src/auth/user.schema';

@Module({
  imports: [
    AuthModule,
    TypegooseModule.forFeature([User]),
  ],
  providers: [VerifyService],
  controllers: [VerifyController]
})
export class VerifyModule { }
