import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { getSubjectDto } from 'src/dto/class/get-subject-dto';
import { addSubjectDto } from 'src/dto/class/add-subject-dto';

@Controller('subject')
export class SubjectController {
  constructor(private readonly subjuctService: SubjectService) {}

  @Get(':/id')
  async getSubjects(@Param() params: getSubjectDto) {
    throw new HttpException(
      {
        code: HttpStatus.OK,
        success: true,
        message: 'Subjects fetched successfully',
        data: await this.subjuctService.getSubjects(Number(params.id)),
      },
      HttpStatus.OK,
    );
  }

  @Post()
  async addSubject(@Body() body: addSubjectDto) {
    throw new HttpException(
      {
        code: HttpStatus.OK,
        success: true,
        message: 'Subject created successfully',
        data: await this.subjuctService.addSubject(body.title, body.description, typeof body.id === 'string' ? Number(body.id) : body.id),
      },
      HttpStatus.OK,
    );
  }

  @Put()
  async editSubject(@Body() body: addSubjectDto) {
    throw new HttpException(
      {
        code: HttpStatus.OK,
        success: true,
        message: 'Subject updated successfully',
        data: await this.subjuctService.editSubject(body.title, body.description, typeof body.id === 'string' ? Number(body.id) : body.id),
      },
      HttpStatus.OK,
    );
  }

  @Delete("/:id")
  async deleteSubject(@Param() params: getSubjectDto) {
    throw new HttpException(
      {
        code: HttpStatus.OK,
        success: true,
        message: 'Subject deleted successfully',
        data: await this.subjuctService.deleteSubject(Number(params.id)),
      },
      HttpStatus.OK,
    );
  }
}
