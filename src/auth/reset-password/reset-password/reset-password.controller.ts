import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ResetPasswordService } from './reset-password.service';
import { AuthService } from 'src/auth/auth.service';
import { ResetPasswordDto } from 'src/dto/auth/reset-password-dto';

@ApiTags('Authentication')
@Controller('auth/reset-password')
export class ResetPasswordController {
  constructor(
    private readonly authService: AuthService,
    private readonly resetPasswordService: ResetPasswordService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Reset Password' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Password reset successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Email is required' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
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

    const verifyToken = await this.resetPasswordService.verifyToken(email, token);
    if (verifyToken.success) {
      const responseData = await this.resetPasswordService.changePassword(email, await this.authService.hashText(password));
      const length = Object.keys(responseData).length > 0;
      throw new HttpException(
        {
          code: length ? HttpStatus.OK : HttpStatus.NOT_FOUND,
          success: length,
          message: length ? 'Password reset successfully' : 'User not found',
          data: responseData,
        },
        length ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      );
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
