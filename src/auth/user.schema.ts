import { prop } from '@typegoose/typegoose';
import UserRole from 'src/shared/enum/user-role.enum';

export class User {
  @prop({
    required: true,
    unique: true,
  })
  readonly email: string;

  @prop({
    required: true,
  })
  readonly password: string;

  @prop({
    required: true,
  })
  readonly firstname: string;

  @prop({
    required: true,
  })
  readonly lastname: string;

  @prop({
    required: true,
  })
  readonly gender: string;

  @prop({
    required: true,
  })
  readonly created_at: Date;

  @prop({
    required: true,
  })
  readonly updated_at: Date;
  
  @prop({
    required: true,
  })
  readonly date_of_birth: Date;

  @prop({
    required: true,
  })
  readonly password_salt: string;

  @prop({
    required: true,
    default: UserRole.GUEST,
  })
  readonly role: string;

  @prop()
  readonly phone_number?: string;

  @prop()
  readonly vertification_code?: string;

  @prop()
  readonly nickname?: string;

  @prop()
  readonly address?: string;

  @prop()
  readonly avatar?: string;
}