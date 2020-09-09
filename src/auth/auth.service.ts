import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { User } from './user.schema';
import { ReturnModelType } from '@typegoose/typegoose';
import * as bcrypt from 'bcrypt';
import * as cryptoRandomString from 'crypto-random-string';

import { hashPassword } from './user.helper';
import SignupCredentialsDto from './dto/signup-credential.dto';
import { MailService } from 'src/mail/mail.service';
import EmailTemplateEnum from 'src/shared/enum/email-template.enum';
import { IRegisterVertificationMailContext } from 'src/mail/mail-context.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
    private readonly mailService: MailService
  ) { }

  async signUp(signupCredentialDto: SignupCredentialsDto): Promise<void> {
    const { email, password, firstname, lastname, gender, date, month, year } = signupCredentialDto;
    const date_of_birth = new Date(year, month - 1, date);
    const vertification_code = cryptoRandomString({ length: 8 });

    const salt = await bcrypt.genSalt();
    const created_user = new this.userModel({
      email,
      firstname,
      lastname,
      gender,
      created_at: new Date(),
      updated_at: new Date(),
      date_of_birth,
      password_salt: salt,
      password: await hashPassword(password, salt),
      vertification_code
    });
    await created_user.save();
    const context: IRegisterVertificationMailContext = { username: firstname, code: vertification_code }
    this.mailService.sendMailToGuest(EmailTemplateEnum.REGISTER_VERTIFICATION, email, 'Verify your account on Fine Social', context);
  }
}
