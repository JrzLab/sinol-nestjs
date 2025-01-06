import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ClassService } from './class.service';
import { getClassDto } from 'src/dto/class/get-class-dto';
import { addClassDto } from 'src/dto/class/add-class-dto';
import { updateClassDto } from 'src/dto/class/update-class-dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { deleteClassDto } from 'src/dto/class/delete-class-dto';

@ApiTags('Class')
@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get('/:email')
  @ApiOperation({ summary: 'Get class by user email' })
  @ApiParam({ name: 'email', type: 'string', description: 'User Email' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Get class successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Get class failed or no data' })
  async getClass(@Param() params: getClassDto) {
    const uClassData = await this.classService.getUClass(params.email);
    throw new HttpException(
      {
        code: HttpStatus.OK,
        success: true,
        message: 'Class retrieved successfully',
        data: {
          uid: uClassData.uid.split('-')[0],
          userId: uClassData.userId,
          createdAt: uClassData.createdAt,
          groupClass: uClassData.groupClass,
        },
      },
      HttpStatus.OK,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Add a new class' })
  @ApiBody({ type: addClassDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Class created successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Class creation failed' })
  async addClass(@Body() body: addClassDto) {
    const { uid, className, description, email } = body;
    throw new HttpException(
      {
        code: HttpStatus.OK,
        success: true,
        message: 'Class created successfully',
        data: await this.classService.addGClass(uid, className, description, email),
      },
      HttpStatus.OK,
    );
  }

  @Put()
  @ApiOperation({ summary: 'Update a class' })
  @ApiBody({ type: updateClassDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Class updated successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Class update failed' })
  async updateClass(@Body() body: updateClassDto) {
    const { id, className, description } = body;
    throw new HttpException(
      {
        code: HttpStatus.OK,
        success: true,
        message: 'Class updated successfully',
        data: await this.classService.updateClass(id, className, description),
      },
      HttpStatus.OK,
    );
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a class' })
  @ApiParam({ name: 'id', type: 'string', description: 'Class ID' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Class deleted successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Class deletion failed' })
  async deleteClass(@Param() params: deleteClassDto) {
    throw new HttpException(
      {
        code: HttpStatus.OK,
        success: true,
        message: 'Class deleted successfully',
        data: await this.classService.deleteClass(Number(params.id)),
      },
      HttpStatus.OK,
    );
  }
}
