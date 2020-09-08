import { IsString, IsEmail, Matches, MinLength, IsIn, IsDate } from 'class-validator';
import Gender from 'src/shared/enum/gender.enum';

class SignupCredentialsDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password too weak!' })
  @MinLength(5)
  password: string;

  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsIn([Gender.MALE, Gender.FEMALE], { message: 'Invalid gender!' })
  gender: string;

  @IsString()
  date: number

  @IsString()
  month: number

  @IsString()
  year: number
}

export default SignupCredentialsDto;