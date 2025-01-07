import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindUserDto } from 'src/dto/user/find-user-dto';
import { getUserDto } from 'src/dto/user/get-user-dto';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { addProfileDto } from 'src/dto/user/add-profile-dto';

@ApiTags('Users')
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

  @Get('change-profile/:id')
  @ApiOperation({ summary: 'Get change profile picture' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Get profile picture' })
  async getChangeProfile(@Param() params: getUserDto) {
    throw new HttpException(
      {
        code: HttpStatus.OK,
        status: true,
        message: 'Get profile picture',
        data: await this.userService.getChangeProfile(params.id),
      },
      HttpStatus.OK,
    );
  }

  @Post('change-profile')
  @ApiOperation({ summary: 'Change profile picture' })
  @ApiBody({ type: addProfileDto })
  @ApiResponse({ status: 200, description: 'Profile picture changed successfully' })
  @UseInterceptors(FileInterceptor('file'))
  async changeProfile(@Body() body: addProfileDto, @UploadedFile() file: Express.Multer.File) {
    throw new HttpException(
      {
        code: HttpStatus.OK,
        status: true,
        message: 'Profile picture changed successfully',
        data: await this.userService.changeProfilePicture(body.email, file),
      },
      HttpStatus.OK,
    );
  }
}
