import { Injectable, ConflictException, InternalServerErrorException, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
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
import SignInCredentialsDto from './dto/signIn-credential.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) { }

  async signUp(signupCredentialDto: SignupCredentialsDto): Promise<{ accessToken: string }> {
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
      vertification_code,
    });

    try {
      await created_user.save();

      const context: IRegisterVertificationMailContext = { username: firstname, code: vertification_code }
      this.mailService.sendMailToGuest(EmailTemplateEnum.REGISTER_VERTIFICATION, email, 'Verify your account on Fine Social', context);

      const jwtPayload: IJwtPayLoad = { _id: created_user.id, firstname, lastname, isVerify: false };
      const accessToken = this.generateAccessToken(created_user.id, jwtPayload);
      const refreshToken = this.generateRefreshToken(created_user.id, jwtPayload);

      await this.userModel.updateOne({ _id: created_user.id }, { refresh_token: refreshToken });

      return { accessToken };
    } catch (error) {
      if (error.code === ErrorCode.CONFLICT_UNIQUE) {
        throw new ConflictException('Email đã có người sử dụng!');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(signInCredentialDto: SignInCredentialsDto): Promise<{ accessToken }> {
    const { email, password } = signInCredentialDto;
    const user = await this.validateUserPassword(email, password);

    if (!user) {
      throw new UnauthorizedException('Sai tên tài khoản hoặc mật khẩu!')
    }

    const jwtPayload: IJwtPayLoad = {
      _id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      isVerify: user.vertification_code === null,
    }

    const accessToken = this.generateAccessToken(user.id, jwtPayload);
    const refreshToken = this.generateRefreshToken(user.id, jwtPayload);

    await this.userModel.updateOne({ _id: user.id }, { refresh_token: refreshToken });

    return { accessToken };
  }

  generateAccessToken(userId: string, payload: IJwtPayLoad): string {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRE,
      audience: userId,
    });

    return accessToken;
  }

  generateRefreshToken(userId: string, payload: IJwtPayLoad): string {
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_SECRET_EXPIRE,
      audience: userId,
    });

    return refreshToken;
  }

  async validateUserPassword(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (user && await user.validatePassword(password)) {
      return user;
    }
    return null;
  }
}
