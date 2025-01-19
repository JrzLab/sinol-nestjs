import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserPrismaService } from 'src/prisma/userPrisma/user-prisma.service';

@Injectable()
export class SignInService {
  constructor(
    private readonly userService: UserPrismaService,
    private readonly authService: AuthService,
  ) {}

  async loginUsers(email: string, password: string) {
    const userData = await this.userService.findUserByIdentifier({ email });
    if (!userData) {
      return {
        success: false,
        message: 'User not found',
        data: {},
      };
    }

    if (userData.password === '') {
      return {
        success: false,
        message: 'Password not set',
        data: {},
      };
    }

    const uClassData = await this.authService.addUidUserClass(email);
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
        uid: uClassData.uid.split('-')[0],
        firstName: userData.firstName,
        lastName: userData.lastName,
        imageUrl: userData.imageUrl,
        email: userData.email,
        joinedAt: userData.createdAt,
        loginAt: Math.floor(Date.now() / 1000),
      },
    };
  }
}
