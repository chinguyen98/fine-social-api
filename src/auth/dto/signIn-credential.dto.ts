import { IsEmail, IsString } from "class-validator";

class SignInCredentialsDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  password: string;
}

export default SignInCredentialsDto;