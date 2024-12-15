import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { SignUpService } from './sign-up.service';
import { IRegister } from 'src/interfaces/interface-auth';

@Controller('auth/sign-up')
export class SignUpController {
  constructor(private readonly signUpService: SignUpService) {}

  @Post()
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
