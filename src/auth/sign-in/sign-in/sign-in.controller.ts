import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { SignInService } from './sign-in.service';
import { ApiTags, ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';
import { SignInDto } from 'src/dto/auth/sign-in-dto';

@ApiTags('Authentication')
@Controller('auth/sign-in')
export class SignInController {
  constructor(private readonly signInService: SignInService) {}

  @Post()
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Login Successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Email and Password are required' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User not found or invalid password' })
  async loginUser(@Body() body: SignInDto) {
    const { email, password } = body;

    if (!email || !password) {
      throw new HttpException(
        {
          code: HttpStatus.BAD_REQUEST,
          success: false,
          message: 'Email and Password are required',
          data: {},
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.signInService.loginUsers(email, password);

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
          code: HttpStatus.UNAUTHORIZED,
          success: false,
          message: result.message,
          data: {},
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
