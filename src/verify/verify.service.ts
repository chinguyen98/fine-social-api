import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { User } from 'src/auth/user.schema';
import MailCodeDto from './dto/mail-code.dto';

@Injectable()
export class VerifyService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
  ) { }

  async verifyMailCode(mailCodeDto: MailCodeDto) {
    console.log(mailCodeDto);
  }
}
