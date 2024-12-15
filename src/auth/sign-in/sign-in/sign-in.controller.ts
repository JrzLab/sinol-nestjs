import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { SignInService } from './sign-in.service';
import { ApiTags, ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';
import { LoginDto } from 'src/dto/login-dto';
import { ILogin } from 'src/interfaces/interface-auth';

@ApiTags('Auth')
@Controller('auth/sign-in')
export class SignInController {
    constructor(private readonly signInService: SignInService) {}

    @Post()
    @ApiOperation({ summary: 'Login user' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({ status: HttpStatus.OK, description: 'Login Successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Email, Username and Password are required' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User not found or invalid password' })
    async loginUser(@Body() body: ILogin) {
        const { email, username, password } = body;

        if (!password || (!email && !username)) {
        throw new HttpException(
            {
            code: HttpStatus.BAD_REQUEST,
            status: false,
            message: 'Email, Username and Password are required',
            data: {},
            },
            HttpStatus.BAD_REQUEST,
        );
        }

        const result = await this.signInService.loginUsers(body);

        if (result.success) {
        return {
            code: HttpStatus.OK,
            status: true,
            message: result.message,
            data: result.data,
        };
        } else {
        throw new HttpException(
            {
            code: result.success ? HttpStatus.OK : HttpStatus.UNAUTHORIZED,
            status: false,
            message: result.message,
            data: {},
            },
            result.success ? HttpStatus.OK : HttpStatus.UNAUTHORIZED,
        );
        }
    }
}
