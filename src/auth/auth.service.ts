import { Injectable, ConflictException, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as cryptoRandomString from 'crypto-random-string';
import * as moment from 'moment';

import { hashPassword } from './user.helper';
import { User } from './user.schema';
import { MailService } from 'src/mail/mail.service';
import { IRegisterVertificationMailContext } from 'src/mail/mail-context.interface';
import SignupCredentialsDto from './dto/signup-credential.dto';
import EmailTemplateEnum from 'src/shared/enum/email-template.enum';
import ErrorCode from 'src/shared/enum/error-code.enum';
import IJwtPayLoad from './jwt-payload.interface';
import IDualToken from './dual-token.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) { }

  async signUp(signupCredentialDto: SignupCredentialsDto): Promise<IDualToken> {
    const { email, password, firstname, lastname, gender, day, month, year } = signupCredentialDto;
    const isValidDate = moment(`${year} ${month} ${day}`, 'YYYY/MM/DD').isValid();

    if (!isValidDate) {
      throw new NotAcceptableException('Invalid date format!');
    }

    const date_of_birth = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
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

    try {
      await created_user.save();

      const context: IRegisterVertificationMailContext = { username: firstname, code: vertification_code }
      this.mailService.sendMailToGuest(EmailTemplateEnum.REGISTER_VERTIFICATION, email, 'Verify your account on Fine Social', context);

      const jwtPayload: IJwtPayLoad = { firstname, lastname, isVerify: false };
      const accessToken = this.jwtService.sign(jwtPayload, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRE,
      });
      const refreshToken = this.jwtService.sign(jwtPayload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: process.env.REFRESH_TOKEN_SECRET_EXPIRE,
      });

      return { accessToken, refreshToken };
    } catch (error) {
      if (error.code === ErrorCode.CONFLICT_UNIQUE) {
        throw new ConflictException('Email đã có người sử dụng!');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
