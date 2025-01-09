import { Controller, Post, HttpException, HttpStatus, Body } from '@nestjs/common';
import { SigninGoogleService } from './signin-google.service';
import { SigninGoogleDto } from 'src/dto/auth/signin-google-dto';

@Controller('auth/signin-google')
export class SigninGoogleController {
  constructor(private readonly signinGoogleService: SigninGoogleService) {}

  @Post()
  async signinGoogle(@Body() body: SigninGoogleDto) {
    const { email, firstName } = body;

    if (!email || !firstName) {
      throw new HttpException(
        {
          code: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Email and First Name are required',
          data: {},
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.signinGoogleService.fetchOrCreateUsers(body);

    if (result.success) {
      throw new HttpException(
        {
          code: HttpStatus.OK,
          success: true,
          message: result.message,
          data: result.data,
        },
        HttpStatus.OK,
      );
    } else {
      throw new HttpException(
        {
          code: HttpStatus.BAD_REQUEST,
          success: false,
          message: result.message,
          data: result.data,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
