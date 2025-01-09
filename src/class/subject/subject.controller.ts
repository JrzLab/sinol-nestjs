import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { getSubjectDto } from 'src/dto/class/get-subject-dto';
import { addSubjectDto } from 'src/dto/class/add-subject-dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { updateSubjectDto } from 'src/dto/class/update-subject-dto';
import { deleteSubjectDto } from 'src/dto/class/delete-subject-dto';

@ApiTags('Class')
@Controller('class/subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Get('/:uid')
  @ApiOperation({ summary: 'Get subjects by class uid' })
  @ApiParam({ name: 'uid', type: 'string', description: 'User Class UID' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Get subject successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Get subject failed or no data' })
  async getSubjects(@Param() params: getSubjectDto) {
    throw new HttpException(
      {
        code: HttpStatus.OK,
        success: true,
        message: 'Subjects fetched successfully',
        data: await this.subjectService.getSubjects(params.uid),
      },
      HttpStatus.OK,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Add a new subject' })
  @ApiBody({ type: addSubjectDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Subject created successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Subject creation failed' })
  async addSubject(@Body() body: addSubjectDto) {
    throw new HttpException(
      {
        code: HttpStatus.OK,
        success: true,
        message: 'Subject created successfully',
        data: await this.subjectService.addSubject(body.title, body.description, body.uid),
      },
      HttpStatus.OK,
    );
  }

  @Put()
  @ApiOperation({ summary: 'Edit a subject' })
  @ApiBody({ type: updateSubjectDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Subject updated successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Subject update failed' })
  async editSubject(@Body() body: updateSubjectDto) {
    throw new HttpException(
      {
        code: HttpStatus.OK,
        success: true,
        message: 'Subject updated successfully',
        data: await this.subjectService.editSubject(body.title, body.description, Number(body.id)),
      },
      HttpStatus.OK,
    );
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a subject' })
  @ApiParam({ name: 'id', type: 'string', description: 'Subject ID' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Subject deleted successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Subject deletion failed' })
  async deleteSubject(@Param() params: deleteSubjectDto) {
    throw new HttpException(
      {
        code: HttpStatus.OK,
        success: true,
        message: 'Subject deleted successfully',
        data: await this.subjectService.deleteSubject(Number(params.id)),
      },
      HttpStatus.OK,
    );
  }
}
