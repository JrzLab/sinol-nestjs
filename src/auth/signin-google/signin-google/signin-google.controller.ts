import { Controller, Post, HttpException, HttpStatus, Body } from '@nestjs/common';
import { SigninGoogleService } from './signin-google.service';
import { SigninGoogleDto } from 'src/dto/auth/signin-google-dto';

@Controller('auth/signin-google')
export class SigninGoogleController {
  constructor(private readonly signinGoogleService: SigninGoogleService) {}

  @Post()
  async signinGoogle(@Body() body: SigninGoogleDto) {
    const { email, firstName, lastName, imageUrl } = body;
    try {
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
        return {
          code: HttpStatus.OK,
          success: true,
          message: result.message,
          data: result.data,
        };
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
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: error.message || 'Internal Server Error',
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
