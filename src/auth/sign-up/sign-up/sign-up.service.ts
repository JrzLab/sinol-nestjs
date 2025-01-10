import { Injectable } from '@nestjs/common';
import { UserPrismaService } from 'src/prisma/userPrisma/user-prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { SignUpDto } from 'src/dto/auth/sign-up-dto';

@Injectable()
export class SignUpService {
  constructor(
    private readonly userPrismaService: UserPrismaService,
    private readonly authService: AuthService,
  ) {}

  async createUser(body: SignUpDto) {
    const { email, password, firstName } = body;

    const userExists = await this.userPrismaService.findUserByIdentifier({ email });
    if (userExists) {
      const emailExists = userExists.email.toLowerCase() === email.toLowerCase();

      const conflicts: string[] = [];
      if (emailExists) conflicts.push('Email');

      return {
        success: false,
        message: 'User creation failed because already exists',
        data: { conflicts },
      };
    }

    try {
      const hashPassword = await this.authService.hashText(password);
      const userData = await this.userPrismaService.create({ email, password: hashPassword, firstName });
      const uClassData = await this.authService.addUidUserClass(email);
      return {
        success: true,
        message: 'User created successfully',
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
    } catch (error) {
      return {
        success: false,
        message: 'User creation failed',
        data: { error },
      };
    }
  }
}
