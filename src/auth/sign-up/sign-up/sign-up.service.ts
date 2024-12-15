import { Injectable } from '@nestjs/common';
import { IRegister } from 'src/utility/interfaces/interface-auth';
import { UserService } from 'src/prisma/user/user.service';
import { compareText, hashText } from 'src/utility/function/function-auth';

@Injectable()
export class SignUpService {
  constructor(private readonly userService: UserService) {}

  async createUser(body: IRegister) {
    const { email, password, username } = body;

    const userExists = await this.userService.findUserData({ email, username });
    if (userExists.length) {
      const usernameExists = userExists.some((user) => user.username.toLowerCase() === username.toLowerCase());
      const emailExists = userExists.some((user) => user.email.toLowerCase() === email.toLowerCase());

      const conflicts: string[] = [];
      if (usernameExists) conflicts.push('Username');
      if (emailExists) conflicts.push('Email');

      return {
        success: false,
        message: 'User creation failed because already exists',
        data: { conflicts },
      };
    }

    try {
      const hashPassword = await hashText(password);
      const userData = await this.userService.create({ email, password: hashPassword, username });
      return {
        success: true,
        message: 'User created successfully',
        data: { displayName: userData.displayName, email: userData.email, joinedAt: userData.joinedAt },
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
