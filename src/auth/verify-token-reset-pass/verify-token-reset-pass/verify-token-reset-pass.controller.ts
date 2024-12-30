import { Controller, HttpException, HttpStatus, Post, Body } from '@nestjs/common';
import { VerifyTokenResetPassDto } from 'src/dto/auth/verify-token-reset-pass-dto';
import { VerifyTokenResetPassService } from './verify-token-reset-pass.service';

@Controller('auth/verify-token-reset-pass')
export class VerifyTokenResetPassController {
  constructor(
    private readonly verifyTokenResetPassService: VerifyTokenResetPassService,
  ) {}

  @Post()
  async verifyTokenResetPass(@Body() body: VerifyTokenResetPassDto) {
    const { token, email } = body;

    if (!token || !email) {
      throw new HttpException(
        {
          code: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Token and Email are required',
          data: {},
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const response = await this.verifyTokenResetPassService.verifyToken({ email, token });

    if (response.success) {
      throw new HttpException(
        {
          code: response.code,
          success: response.success,
          message: response.message,
          data: response.data,
        },
        response.code || HttpStatus.OK,
      );
    } else {
      throw new HttpException(
        {
          code: response.code,
          success: false,
          message: response.message,
          data: response.data,
        },
        response.code,
      );
    }
  }
}
