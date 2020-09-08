import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { User } from './user.schema';
import { ReturnModelType } from '@typegoose/typegoose';
import * as bcrypt from 'bcrypt';

import { hashPassword } from './user.helper';
import SignupCredentialsDto from './dto/signup-credential.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>
  ) { }

  async signUp(signupCredentialDto: SignupCredentialsDto): Promise<void> {
    const { email, password, firstname, lastname, gender, date, month, year } = signupCredentialDto;
    const date_of_birth = new Date(year, month - 1, date);

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
    });
    await created_user.save();
  }
}
