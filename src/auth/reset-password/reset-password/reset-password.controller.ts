import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { IResetPassword } from 'src/utility/interfaces/interface-auth';
import { ResetPasswordService } from './reset-password.service';
import { UserService } from 'src/prisma/user/user.service';
import { AuthService } from 'src/auth/auth.service';

@Controller('auth/reset-password')
export class ResetPasswordController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly resetPasswordService: ResetPasswordService,
  ) {}

  @Post()
  async resetPassword(@Body() body: IResetPassword) {
    const { email, password, token } = body;
    if (!email) {
      throw new HttpException(
        {
          code: HttpStatus.BAD_REQUEST,
          status: false,
          message: 'Email is required',
          data: {},
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const verifyToken = await this.resetPasswordService.verifyToken(email, token);
    if (verifyToken.status) {
      const hashPassword = await this.authService.hashText(password);
      const responseData = await this.userService.changePassword({ email }, { password: hashPassword });
      if (responseData.password === hashPassword) {
        throw new HttpException(
          {
            code: HttpStatus.OK,
            status: true,
            message: verifyToken.message,
            data: {},
          },
          HttpStatus.OK,
        );
      }
    }

    throw new HttpException(
      {
        code: HttpStatus.UNAUTHORIZED,
        status: false,
        message: verifyToken.message,
        data: {},
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
