import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import SignInCredentialsDto from './dto/signIn-credential.dto';
import SignupCredentialsDto from './dto/signup-credential.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/signup')
  signup(@Body(ValidationPipe) signupCredentialsDto: SignupCredentialsDto): Promise<{ accessToken: string }> {
    return this.authService.signUp(signupCredentialsDto);
  }

  @Post('/signin')
  signin(@Body(ValidationPipe) signInCredentialsDto: SignInCredentialsDto): Promise<{ accessToken }> {
    return this.authService.signIn(signInCredentialsDto);
  }
}
