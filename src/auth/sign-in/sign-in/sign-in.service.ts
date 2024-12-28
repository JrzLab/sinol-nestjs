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

    const passwordMatch = await this.authService.compareHashText(password, userData.password);
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
        firstName: userData.firstName,
        email: userData.email,
        joinedAt: userData.createdAt,
      },
    };
  }
}
