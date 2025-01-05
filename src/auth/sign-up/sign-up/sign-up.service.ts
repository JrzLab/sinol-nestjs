import { Injectable } from '@nestjs/common';
import { UserPrismaService } from 'src/prisma/userPrisma/user-prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { SignUpDto } from 'src/dto/auth/sign-up-dto';

@Injectable()
export class SignUpService {
  constructor(
    private readonly userService: UserPrismaService,
    private readonly authService: AuthService,
  ) {}

  async createUser(body: SignUpDto) {
    const { email, password, firstName } = body;

    const userExists = await this.userService.findUserByIdentifier({ email, firstName });
    if (userExists) {
      const firstNameExists = userExists.firstName.toLowerCase() === firstName.toLowerCase();
      const emailExists = userExists.email.toLowerCase() === email.toLowerCase();

      const conflicts: string[] = [];
      if (firstNameExists) conflicts.push('FirstName');
      if (emailExists) conflicts.push('Email');

      return {
        success: false,
        message: 'User creation failed because already exists',
        data: { conflicts },
      };
    }

    try {
      const hashPassword = await this.authService.hashText(password);
      const userData = await this.userService.create({ email, password: hashPassword, firstName });
      return {
        success: true,
        message: 'User created successfully',
        data: { firstName: userData.firstName, email: userData.email, joinedAt: userData.createdAt },
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
