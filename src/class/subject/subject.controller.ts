import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { GetSubjectDto } from 'src/dto/class/subject/get-subject-dto';
import { AddSubjectDto } from 'src/dto/class/subject/add-subject-dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateSubjectDto } from 'src/dto/class/subject/update-subject-dto';
import { DeleteSubjectDto } from 'src/dto/class/subject/delete-subject-dto';

@ApiTags('Subject')
@Controller('class/subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Get('/:uid')
  @ApiOperation({ summary: 'Get subjects by class uid' })
  @ApiParam({ name: 'uid', type: 'string', description: 'Class UID' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Get subject successfully' })
  async getSubjects(@Param() params: GetSubjectDto) {
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

  @Post('create')
  @ApiOperation({ summary: 'Add a new subject - POSTMAN' })
  @ApiBody({ type: AddSubjectDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Subject created successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Subject creation failed' })
  async addSubject(@Body() body: AddSubjectDto) {
    const { title, description, maxScore, dueDate, uid } = body;
    const createData = await this.subjectService.addSubject(title, description, maxScore, dueDate, uid);
    const length = Object.keys(createData).length > 0;
    throw new HttpException(
      {
        code: length ? HttpStatus.CREATED : HttpStatus.CONFLICT,
        success: length,
        message: length ? 'Subject created successfully' : 'Subject creation failed',
        data: createData,
      },
      length ? HttpStatus.CREATED : HttpStatus.CONFLICT,
    );
  }

  @Put('edit')
  @ApiOperation({ summary: 'Edit a subject' })
  @ApiBody({ type: UpdateSubjectDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Subject updated successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Subject update failed' })
  async editSubject(@Body() body: UpdateSubjectDto) {
    const { title, description, maxScore, dueDate, id } = body;
    const updateData = await this.subjectService.editSubject(title, description, maxScore, dueDate, id);
    const length = Object.keys(updateData).length > 0;
    throw new HttpException(
      {
        code: length ? HttpStatus.CREATED : HttpStatus.CONFLICT,
        success: length,
        message: length ? 'Subject updated successfully' : 'Subject update failed',
        data: updateData,
      },
      length ? HttpStatus.CREATED : HttpStatus.CONFLICT,
    );
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a subject' })
  @ApiParam({ name: 'id', type: 'string', description: 'Subject ID' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Subject deleted successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Subject deletion failed' })
  async deleteSubject(@Param() params: DeleteSubjectDto) {
    const deleteData = await this.subjectService.deleteSubject(Number(params.id));
    const length = Object.keys(deleteData).length > 0;
    throw new HttpException(
      {
        code: length ? HttpStatus.CREATED : HttpStatus.CONFLICT,
        success: length,
        message: length ? 'Subject deleted successfully' : 'Subject deletion failed',
        data: deleteData,
      },
      length ? HttpStatus.CREATED : HttpStatus.CONFLICT,
    );
  }
}
