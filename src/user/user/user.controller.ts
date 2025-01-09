import { Body, Controller, Get, HttpException, HttpStatus, Param, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { getUserDto } from 'src/dto/user/get-user-dto';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { addProfileDto } from 'src/dto/user/add-profile-dto';
import { updateUserDto } from 'src/dto/user/update-user-dto';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users data retrieved successfully' })
  async getUsersData() {
    throw new HttpException(
      {
        code: HttpStatus.OK,
        success: true,
        message: 'Users data retrieved successfully',
        data: await this.userService.findAllUsers(),
      },
      HttpStatus.OK,
    );
  }

  @Get('/:email')
  @ApiOperation({ summary: 'Get user data by params ID' })
  @ApiParam({ name: 'name', type: 'string', description: 'User Email' })
  @ApiResponse({ status: 200, description: 'User data retrieved successfully' })
  async getUserData(@Param() params: getUserDto) {
    const userData = await this.userService.findUser('', params.email);
    throw new HttpException(
      {
        code: userData ? HttpStatus.OK : HttpStatus.NOT_FOUND,
        success: !!userData,
        message: userData ? 'User data retrieved successfully' : 'User not found',
        data: userData ?? {},
      },
      userData ? HttpStatus.OK : HttpStatus.NOT_FOUND,
    );
  }

  @Put('change-data')
  @ApiOperation({ summary: 'Change user data' })
  @ApiBody({ type: updateUserDto })
  @ApiResponse({ status: 200, description: 'User data changed successfully' })
  async changeUserData(@Body() body: updateUserDto) {
    throw new HttpException(
      {
        code: HttpStatus.OK,
        success: true,
        message: 'User data changed successfully',
        data: await this.userService.updateUser(body.email, body.firstName, body.lastName, body.emailChange),
      },
      HttpStatus.OK,
    );
  }

  @Put('change-profile')
  @ApiOperation({ summary: 'Change profile picture' })
  @ApiBody({ type: addProfileDto })
  @ApiResponse({ status: 200, description: 'Profile picture changed successfully' })
  @UseInterceptors(FileInterceptor('file'))
  async changeProfile(@Body() body: addProfileDto, @UploadedFile() file: Express.Multer.File) {
    throw new HttpException(
      {
        code: HttpStatus.OK,
        success: true,
        message: 'Profile picture changed successfully',
        data: await this.userService.changeProfilePicture(body.email, file),
      },
      HttpStatus.OK,
    );
  }
}
