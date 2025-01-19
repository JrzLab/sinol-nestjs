import { Controller, Post, HttpException, HttpStatus, Body } from '@nestjs/common';
import { SigninGoogleService } from './signin-google.service';
import { SigninGoogleDto } from 'src/dto/auth/signin-google-dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth/signin-google')
export class SigninGoogleController {
  constructor(private readonly signinGoogleService: SigninGoogleService) {}

  @Post()
  @ApiOperation({ summary: 'Sign in with Google' })
  @ApiBody({ type: SigninGoogleDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Sign in with Google successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Sign in with Google failed' })
  async signinGoogle(@Body() body: SigninGoogleDto) {
    const { email, firstName, lastName, imageUrl } = body;

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

    const result = await this.signinGoogleService.fetchOrCreateUsers(email, firstName, lastName, imageUrl);

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
