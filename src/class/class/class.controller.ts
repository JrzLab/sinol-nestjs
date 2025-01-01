import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { ClassService } from './class.service';
import { getClassDto } from 'src/dto/class/get-class-dto';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get('/:email')
  async getClass(@Param() params: getClassDto) {
    const { email } = params;
    throw new HttpException(
      {
        code: HttpStatus.OK,
        success: true,
        message: 'Class retrieved successfully',
        data: await this.classService.getClass(email) ?? {},
      },
      HttpStatus.OK,
    );
  }
}
