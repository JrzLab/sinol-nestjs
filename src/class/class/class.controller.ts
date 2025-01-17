import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ClassService } from './class.service';
import { GetClassDto } from 'src/dto/class/class/get-class-dto';
import { AddClassDto } from 'src/dto/class/class/add-class-dto';
import { UpdateClassDto } from 'src/dto/class/class/update-class-dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteClassDto } from 'src/dto/class/class/delete-class-dto';
import { JoinClassDto } from 'src/dto/class/class/join-class-dto';

@ApiTags('Class')
@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get('/:uid')
  @ApiOperation({ summary: 'Get class by user uid' })
  @ApiParam({ name: 'uid', type: 'string', description: 'User Class UID' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Get class successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Get class failed or no data' })
  async getClass(@Param() params: GetClassDto) {
    const uClassData = await this.classService.getUClass(params.uid);
    throw new HttpException(
      {
        code: HttpStatus.OK,
        success: true,
        message: 'Class retrieved successfully',
        data: { groupClass: uClassData },
      },
      HttpStatus.OK,
    );
  }

  @Get('/:uid/view-users')
  @ApiOperation({ summary: 'Get all user class by class uid' })
  @ApiParam({ name: 'uid', type: 'string', description: 'Class UID' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Get user class successfully' })
  async getUserClass(@Param() params: GetClassDto) {
    const uClassData = await this.classService.getClassUsers(params.uid);
    throw new HttpException(
      {
        code: HttpStatus.OK,
        success: true,
        message: 'User class retrieved successfully',
        data: { uClassData },
      },
      HttpStatus.OK,
    );
  }

  @Post('create')
  @ApiOperation({ summary: 'Add a new class' })
  @ApiBody({ type: AddClassDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Class created successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Class creation failed' })
  async addClass(@Body() body: AddClassDto) {
    const { uid, className, description, email, day } = body;
    const addClass = await this.classService.addGClass(uid, className, description, email, Number(day));
    const length = Object.keys(addClass).length > 0;
    throw new HttpException(
      {
        code: length ? HttpStatus.OK : HttpStatus.CONFLICT,
        success: length,
        message: length ? 'Class created successfully' : 'Class creation failed',
        data: addClass,
      },
      length ? HttpStatus.OK : HttpStatus.CONFLICT,
    );
  }

  @Post('join')
  @ApiOperation({ summary: 'Join a class' })
  @ApiBody({ type: JoinClassDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Class joined successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Class join failed' })
  async joinClass(@Body() body: JoinClassDto) {
    const { uidClass, uidClassUser } = body;
    const joinClass = await this.classService.joinClass(uidClass, uidClassUser);
    const length = Object.keys(joinClass).length > 0;
    throw new HttpException(
      {
        code: length ? HttpStatus.OK : HttpStatus.CONFLICT,
        success: length,
        message: length ? 'Class joined successfully' : 'Class join failed',
        data: joinClass,
      },
      length ? HttpStatus.OK : HttpStatus.CONFLICT,
    );
  }

  @Post('leave')
  @ApiOperation({ summary: 'Leave a class' })
  @ApiBody({ type: JoinClassDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Class left successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Class leave failed' })
  async leaveClass(@Body() body: JoinClassDto) {
    const { uidClass, uidClassUser } = body;
    const leaveClass = await this.classService.leaveClass(uidClass, uidClassUser);
    const length = Object.keys(leaveClass).length > 0;
    throw new HttpException(
      {
        code: length ? HttpStatus.OK : HttpStatus.CONFLICT,
        success: length,
        message: length ? 'Class left successfully' : 'Class leave failed',
        data: leaveClass,
      },
      length ? HttpStatus.OK : HttpStatus.CONFLICT,
    );
  }

  @Put('update')
  @ApiOperation({ summary: 'Update a class' })
  @ApiBody({ type: UpdateClassDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Class updated successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Class update failed' })
  async updateClass(@Body() body: UpdateClassDto) {
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
  async deleteClass(@Param() params: DeleteClassDto) {
    const deleteClass = await this.classService.deleteClass(params.uid);
    const length = Object.keys(deleteClass).length > 0;
    throw new HttpException(
      {
        code: length ? HttpStatus.OK : HttpStatus.CONFLICT,
        success: length,
        message: length ? 'Class deleted successfully' : 'Class deletion failed',
        data: deleteClass,
      },
      length ? HttpStatus.OK : HttpStatus.CONFLICT,
    );
  }
}
