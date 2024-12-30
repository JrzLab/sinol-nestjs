import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ResetPasswordService } from './reset-password.service';
import { UserService } from 'src/prisma/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { ResetPasswordDto } from 'src/dto/auth/reset-password-dto';

@ApiTags('Authentication')
@Controller('auth/reset-password')
export class ResetPasswordController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly resetPasswordService: ResetPasswordService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Reset Password' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Password reset successfully' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid token' })
  async resetPassword(@Body() body: ResetPasswordDto) {
    const { email, password, token } = body;
    if (!email) {
      throw new HttpException(
        {
          code: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Email is required',
          data: {},
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const verifyToken = await this.resetPasswordService.verifyToken({ email, token });;
    if (verifyToken.success) {
      const hashPassword = await this.authService.hashText(password);
      const responseData = await this.userService.changePassword({ email }, { password: hashPassword });
      if (responseData.password === hashPassword) {
        throw new HttpException(
          {
            code: HttpStatus.OK,
            success: true,
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
        success: false,
        message: verifyToken.message,
        data: {},
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
