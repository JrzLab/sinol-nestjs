import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { SignUpService } from './sign-up.service';
import { IRegister } from 'src/interfaces/interface-auth';
import { ApiTags, ApiResponse, ApiBody, ApiOperation } from '@nestjs/swagger';
import { RegisterDto } from 'src/dto/register-dto';

@ApiTags('Auth')
@Controller('auth/sign-up')
export class SignUpController {
  constructor(private readonly signUpService: SignUpService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User created successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'User creation failed because already exists' })
  async createUser(@Body() body: IRegister) {
    const { email, password, username } = body;

    if (!email || !password || !username) {
      throw new HttpException(
        {
          code: HttpStatus.BAD_REQUEST,
          status: false,
          message: 'Username, Email, and Password are required',
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
