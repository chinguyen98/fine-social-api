import { Body, Controller, Put, UseGuards, ValidationPipe } from '@nestjs/common';

import JwtAuthGuard from 'src/auth/jwt.guard';
import MailCodeDto from './dto/mail-code.dto';
import { GetUser } from 'src/auth/user.decorator';
import { VerifyService } from './verify.service';
import { User } from 'src/auth/user.schema';

@Controller('verify')
@UseGuards(new JwtAuthGuard())
export class VerifyController {
  constructor(private readonly verifyService: VerifyService) { }

  @Put('/email')
  verifyMailCode(
    @Body(ValidationPipe) mailCodeDto: MailCodeDto,
    @GetUser() user: User
  ): Promise<{ accessToken: string }> {
    return this.verifyService.verifyMailCode(mailCodeDto, user);
  }
}
