import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './prisma/user/user.service';
import { ApiTags, ApiResponse, ApiParam, ApiOperation } from '@nestjs/swagger';

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
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'User data retrieved successfully' })
  async getUserData(@Param() params: { id: string }) {
    const { id } = params;
    return this.userService.findUserData({ id: Number(id) });
  }
  
  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  async getUsersData() {
    return this.userService.findUsersData();
  }
}
