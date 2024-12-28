import { Body, Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './prisma/user/user.service';
import { ApiTags, ApiResponse, ApiParam, ApiOperation, ApiBody } from '@nestjs/swagger';
import { FindUserDto } from './dto/find-user-dto';

@ApiTags('Get Users')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get Hello World' })
  getHello() {
    return this.appService.getHello();
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'Get user data by params ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User data retrieved successfully' })
  async getUserData(@Param() params: { id: string }) {
    const { id } = params;
    return this.userService.findUserByIdentifier({ id: Number(id) });
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users data retrieved successfully' })
  async getUsersData() {
    const userData = await this.userService.findUsersData();
    throw new HttpException(
      {
        code: HttpStatus.OK,
        status: true,
        message: 'Users data retrieved successfully',
        data: userData.map((user) => ({ id: user.id, email: user.email, firstName: user.firstName })),
      },
      HttpStatus.OK,
    );
  }

  @Get('findUser')
  @ApiOperation({ summary: 'Find user by email' })
  @ApiResponse({ status: 200, description: 'User data retrieved successfully' })
  @ApiBody({ type: FindUserDto })
  async findUser(@Body() data: FindUserDto) {
    const { email } = data;
    const userData = await this.userService.findUserByIdentifier({ email });
    throw new HttpException(
      {
        code: userData ? HttpStatus.OK : HttpStatus.NOT_FOUND,
        status: !!userData,
        message: userData ? 'User data retrieved successfully' : 'User not found',
        data: userData ? { id: userData.id, email: userData.email, firstName: userData.firstName } : null,
      },
      userData ? HttpStatus.OK : HttpStatus.NOT_FOUND,
    );
  }
}
