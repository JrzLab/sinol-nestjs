import { Body, Controller, HttpException, HttpStatus, Post, ValidationPipe } from '@nestjs/common';
import { SignUpService } from './sign-up.service';
import { ApiTags, ApiResponse, ApiBody, ApiOperation } from '@nestjs/swagger';
import { SignUpDto } from 'src/dto/auth/sign-up-dto';

@ApiTags('Authentication')
@Controller('auth/sign-up')
export class SignUpController {
  constructor(private readonly signUpService: SignUpService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: SignUpDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User created successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'User creation failed because already exists' })
  async createUser(@Body(new ValidationPipe()) body: SignUpDto) {
    const { email, password, firstName } = body;

    if (!email || !password || !firstName) {
      throw new HttpException(
        {
          code: HttpStatus.BAD_REQUEST,
          status: false,
          message: 'firstName, Email, and Password are required',
          data: {},
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const userData = await this.signUpService.createUser(body);

    if (userData.success) {
      throw new HttpException(
        {
          code: HttpStatus.CREATED,
          status: true,
          message: userData.message,
          data: userData.data,
        },
        HttpStatus.CREATED,
      );
    } else {
      throw new HttpException(
        {
          code: HttpStatus.CONFLICT,
          status: false,
          message: userData.message,
          data: userData.data.conflicts || userData.data.error,
        },
        HttpStatus.CONFLICT,
      );
    }
  }
}
