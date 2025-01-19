import { Controller, HttpException, HttpStatus, Post, Body } from '@nestjs/common';
import { VerifyTokenResetPassDto } from 'src/dto/auth/verify-token-reset-pass-dto';
import { VerifyTokenResetPassService } from './verify-token-reset-pass.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth/verify-token-reset-pass')
export class VerifyTokenResetPassController {
  constructor(private readonly verifyTokenResetPassService: VerifyTokenResetPassService) {}

  @Post()
  @ApiOperation({ summary: 'Verify token for reset password' })
  @ApiBody({ type: VerifyTokenResetPassDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Token verified successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Token verification failed' })
  async verifyTokenResetPass(@Body() body: VerifyTokenResetPassDto) {
    const { token, email } = body;

    if ( !email || !token) {
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

    const response = await this.verifyTokenResetPassService.verifyToken(email, token);

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
