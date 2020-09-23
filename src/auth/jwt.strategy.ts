import { PassportStrategy } from "@nestjs/passport";
import { ReturnModelType } from "@typegoose/typegoose";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { ExtractJwt, Strategy } from "passport-jwt";

import { User } from './user.schema';
import IJwtPayLoad from "./jwt-payload.interface";

@Injectable()
class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    });
  }

  async validate(jwtPayload: IJwtPayLoad) {
    const { firstname, lastname } = jwtPayload;
    const user = await this.userModel.findOne({ firstname, lastname });

    if (!user) {
      throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu');
    }

    return user;
  }
}

export default JwtStrategy;