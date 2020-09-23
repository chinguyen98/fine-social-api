import { Body, Controller, Put, UseGuards, ValidationPipe } from '@nestjs/common';

import JwtAuthGuard from 'src/auth/jwt.guard';
import MailCodeDto from './dto/mail-code.dto';
import { VerifyService } from './verify.service';

@Controller('verify')
@UseGuards(new JwtAuthGuard())
export class VerifyController {
  constructor(private readonly verifyService: VerifyService) { }

  @Put('/email')
  verifyMailCode(@Body(ValidationPipe) mailCodeDto: MailCodeDto) {
    return this.verifyService.verifyMailCode(mailCodeDto);
  }
}
