import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ClassService } from './class.service';
import { getClassDto } from 'src/dto/class/get-class-dto';
import { addClassDto } from 'src/dto/class/add-class-dto';
import { updateClassDto } from 'src/dto/class/update-class-dto';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get('/:email')
  async getClass(@Param() params: getClassDto) {
    throw new HttpException(
      {
        code: HttpStatus.OK,
        success: true,
        message: 'Class retrieved successfully',
        data: await this.classService.getUClass(params.email),
      },
      HttpStatus.OK,
    );
  }

  @Post()
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
}
