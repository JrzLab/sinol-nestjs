import { Injectable } from '@nestjs/common';
import { IRegister } from 'src/utility/interfaces/interface-auth';
import { UserService } from 'src/prisma/user/user.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class SignUpService {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async createUser(body: IRegister) {
    const { email, password, firstName } = body;

    const userExists = await this.userService.findUserByIdentifier({ email, firstName });
    if (userExists.length) {
      const firstNameExists = userExists.some((user) => user.firstName.toLowerCase() === firstName.toLowerCase());
      const emailExists = userExists.some((user) => user.email.toLowerCase() === email.toLowerCase());

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
