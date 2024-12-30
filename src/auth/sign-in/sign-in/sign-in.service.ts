import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { SignInDto } from 'src/dto/auth/sign-in-dto';
import { UserService } from 'src/prisma/user/user.service';

@Injectable()
export class SignInService {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async loginUsers(body: SignInDto) {
    const { email, password } = body;

    const userData = await this.userService.findUserByIdentifier({ email });
    if (!userData) {
      return {
        success: false,
        message: 'User not found',
        data: {},
      };
    }

    const user = userData[0];
    const passwordMatch = await this.authService.compareHashText(password, user.password);
    if (!passwordMatch) {
      return {
        success: false,
        message: 'Invalid password',
        data: {},
      };
    }

    return {
      success: true,
      message: 'Login Successfully',
      data: { 
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        email: user.email,
        joinedAt: user.createdAt,
        loginAt: Math.floor(Date.now() / 1000),
      },
    };
  }
}
