import { ForbiddenException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/user.schema';
import IJwtPayLoad from 'src/auth/jwt-payload.interface';
import MailCodeDto from './dto/mail-code.dto';

@Injectable()
export class VerifyService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
    private readonly authService: AuthService,
  ) { }

  async verifyMailCode(mailCodeDto: MailCodeDto, user: any): Promise<{ accessToken: string }> {
    const { mailCode } = mailCodeDto;
    const { _id, vertification_code, firstname, lastname } = user;

    if (vertification_code === null) {
      throw new ForbiddenException();
    }

    if (mailCode === vertification_code) {
      const payload: IJwtPayLoad = {
        _id,
        firstname,
        lastname,
        isVerify: true,
      }

      const accessToken = this.authService.generateAccessToken(user._id.toHexString(), payload);
      const refreshToken = this.authService.generateRefreshToken(user._id.toHexString(), payload);

      await this.userModel.updateOne({ _id: user._id }, { refresh_token: refreshToken, vertification_code: null });

      return { accessToken };
    }
    else {
      throw new UnprocessableEntityException('Mã xác thực không đúng!');
    }
  }
}
