import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './prisma/user/user.service';

interface IParams {
  id: string;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('user/:id')
  async getUserData(@Param() params: IParams) {
    const { id } = params;

    return this.userService.findUserData({ id: Number(id) });
  }

  @Get('users')
  async getUsersData() {
    return this.userService.findUsersData();
  }
}
