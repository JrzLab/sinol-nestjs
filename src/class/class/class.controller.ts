import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ClassService } from './class.service';
import { getClassDto } from 'src/dto/class/class/get-class-dto';
import { addClassDto } from 'src/dto/class/class/add-class-dto';
import { updateClassDto } from 'src/dto/class/class/update-class-dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { deleteClassDto } from 'src/dto/class/class/delete-class-dto';
import { joinClassDto } from 'src/dto/class/class/join-class-dto';

@ApiTags('Class')
@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get('/:uid')
  @ApiOperation({ summary: 'Get class by user uid' })
  @ApiParam({ name: 'uid', type: 'string', description: 'User Class UID' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Get class successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Get class failed or no data' })
  async getClass(@Param() params: getClassDto) {
    const uClassData = await this.classService.getUClass(params.uid);
    throw new HttpException(
      {
        code: HttpStatus.OK,
        success: true,
        message: 'Class retrieved successfully',
        data: {
          groupClass: uClassData.map((data) => ({
            uid: data.groupClass.uid.split('-')[0],
            day: data.groupClass.day,
            className: data.groupClass.className,
            description: data.groupClass.description,
            ownerData: {
              email: data.groupClass.owner.email,
              name: `${data.groupClass.owner.firstName}${data.groupClass.owner.lastName ? ` ${data.groupClass.owner.lastName}` : ''}`,
              imageUrl: data.groupClass.owner.imageUrl,
            },
          })),
        },
      },
      HttpStatus.OK,
    );
  }

  @Post('create')
  @ApiOperation({ summary: 'Add a new class' })
  @ApiBody({ type: addClassDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Class created successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Class creation failed' })
  async addClass(@Body() body: addClassDto) {
    const { uid, className, description, email, day } = body;
    throw new HttpException(
      {
        code: HttpStatus.OK,
        success: true,
        message: 'Class created successfully',
        data: await this.classService.addGClass(uid, className, description, email, Number(day)),
      },
      HttpStatus.OK,
    );
  }

  @Post('join')
  @ApiOperation({ summary: 'Join a class' })
  @ApiBody({ type: joinClassDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Class joined successfully' })
  async joinClass(@Body() body: joinClassDto) {
    const { uidClass, uidClassUser } = body;
    throw new HttpException(
      {
        code: HttpStatus.OK,
        success: true,
        message: 'Class joined successfully',
        data: await this.classService.joinClass(uidClass, uidClassUser),
      },
      HttpStatus.OK,
    );
  }

  @Put('update')
  @ApiOperation({ summary: 'Update a class' })
  @ApiBody({ type: updateClassDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Class updated successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Class update failed' })
  async updateClass(@Body() body: updateClassDto) {
    const { uid, className, description, email, day } = body;
    const updateClass = await this.classService.updateClass(uid, className, description, email, Number(day));
    throw new HttpException(
      {
        code: updateClass.success ? HttpStatus.OK : HttpStatus.CONFLICT,
        success: updateClass.success,
        message: updateClass.message,
        data: updateClass.data,
      },
      updateClass.success ? HttpStatus.OK : HttpStatus.CONFLICT,
    );
  }

  @Delete('/:uid')
  @ApiOperation({ summary: 'Delete a class' })
  @ApiParam({ name: 'uid', type: 'string', description: 'Class UID' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Class deleted successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Class deletion failed' })
  async deleteClass(@Param() params: deleteClassDto) {
    throw new HttpException(
      {
        code: HttpStatus.OK,
        success: true,
        message: 'Class deleted successfully',
        data: await this.classService.deleteClass(params.uid),
      },
      HttpStatus.OK,
    );
  }
}
