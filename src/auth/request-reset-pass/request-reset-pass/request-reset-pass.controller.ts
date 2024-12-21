import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger'
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/prisma/user/user.service';
import { IRequestResetPass } from 'src/utility/interfaces/interface-auth';
import { RequestResetPassService } from './request-reset-pass.service';
import { resetPasswordDto } from 'src/dto/reset-password-dto';

@ApiTags('Authentication')
@Controller('auth/request-reset-pass')
export class RequestResetPassController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly requestResetPasswordService: RequestResetPassService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Request Reset Password' })
  @ApiBody({ type: resetPasswordDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success created token' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async requestResetPass(@Body() body: IRequestResetPass) {
    const { email } = body;
    const userData = await this.userService.findUserByIdentifier({ email });
    if (!userData.length) {
      throw new HttpException(
        {
          code: HttpStatus.NOT_FOUND,
          status: false,
          message: 'User not found',
          data: {},
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const jwtToken = await this.jwtService.signAsync({ email: this.authService.encodeData(email) });
    this.requestResetPasswordService.sendEmail(userData, jwtToken);
    throw new HttpException(
      {
        code: HttpStatus.CREATED,
        status: true,
        message: 'Success created token',
        data: {
          access_token: jwtToken,
        },
      },
      HttpStatus.CREATED,
    );
  }
}
