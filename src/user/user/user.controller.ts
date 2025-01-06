import { Body, Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindUserDto } from 'src/dto/user/find-user-dto';
import { getUserDto } from 'src/dto/user/get-user-dto';
import { UserService } from './user.service';

@ApiTags('Get Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Get user data by params ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User data retrieved successfully' })
  async getUserData(@Param() params: getUserDto) {
    const userData = await this.userService.findUser(params.id, '');
    throw new HttpException(
      {
        code: userData ? HttpStatus.OK : HttpStatus.NOT_FOUND,
        status: !!userData,
        message: userData ? 'User data retrieved successfully' : 'User not found',
        data: userData ?? {},
      },
      userData ? HttpStatus.OK : HttpStatus.NOT_FOUND,
    );
  }

  @Get('findUser')
  @ApiOperation({ summary: 'Find user by email' })
  @ApiBody({ type: FindUserDto })
  @ApiResponse({ status: 200, description: 'User data retrieved successfully' })
  async findUser(@Body() data: FindUserDto) {
    const userData = await this.userService.findUser('', data.email);
    throw new HttpException(
      {
        code: userData ? HttpStatus.OK : HttpStatus.NOT_FOUND,
        status: !!userData,
        message: userData ? 'User data retrieved successfully' : 'User not found',
        data: userData ?? {},
      },
      userData ? HttpStatus.OK : HttpStatus.NOT_FOUND,
    );
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users data retrieved successfully' })
  async getUsersData() {
    throw new HttpException(
      {
        code: HttpStatus.OK,
        status: true,
        message: 'Users data retrieved successfully',
        data: await this.userService.findAllUsers(),
      },
      HttpStatus.OK,
    );
  }
}
