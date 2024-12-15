import { Injectable } from '@nestjs/common';
import { UserService } from 'src/prisma/user/user.service';
import { compareText } from 'src/utility/function/function-auth';
import { ILogin } from 'src/utility/interfaces/interface-auth';

@Injectable()
export class SignInService {
  constructor(private readonly userService: UserService) {}

  async loginUsers(body: ILogin) {
    const { username, email, password } = body;
    if (!password || (!email && !username)) {
      return {
        success: false,
        message: 'Email, Username and Password are required',
        data: {},
      };
    }

    const userData = await this.userService.findUserByIdentifier({ email, username });
    if (!userData.length) {
      return {
        success: false,
        message: 'User not found',
        data: {},
      };
    }

    const user = userData[0];
    const passwordMatch = await compareText(password, user.password);
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
        displayName: user.displayName,
        email: user.email,
        joinedAt: user.joinedAt,
      },
    };
  }
}
