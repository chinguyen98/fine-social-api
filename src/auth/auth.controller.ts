import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import SignupCredentialsDto from './dto/signup-credential.dto';
import IDualToken from './dual-token.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/signup')
  signup(@Body(ValidationPipe) signupCredentialsDto: SignupCredentialsDto): Promise<{ accessToken: string }> {
    return this.authService.signUp(signupCredentialsDto);
  }
}
