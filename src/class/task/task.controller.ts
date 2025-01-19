import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { TaskService } from './task.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AddTaskDto } from 'src/dto/class/task/add-task-dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetTaskDto } from 'src/dto/class/task/get-task-dto';
import { GradeTaskDto } from 'src/dto/class/task/grade-task-dto';

@ApiTags('Task')
@Controller('class/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Get task by ID and Email' })
  @ApiParam({ name: 'id', type: 'string', description: 'ClassSubject ID' })
  @ApiQuery({ name: 'email', type: 'string', description: 'User Email' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async getTask(@Param() data: GetTaskDto, @Query() query: { email: string }) {
    const uTaskData = await this.taskService.getTask(query.email, Number(data.id));
    const length = Object.keys(uTaskData).length > 0;
    throw new HttpException(
      {
        code: length ? HttpStatus.OK : HttpStatus.NOT_FOUND,
        success: length,
        message: length ? 'Task retrieved successfully' : 'Task not found',
        data: uTaskData,
      },
      length ? HttpStatus.OK : HttpStatus.NOT_FOUND,
    );
  }

  @Get('owner/:id')
  @ApiOperation({ summary: 'Get task on owner' })
  @ApiParam({ name: 'id', type: 'string', description: 'ClassSubject ID' })
  @ApiQuery({ name: 'email', type: 'string', description: 'User Email' })
  @ApiResponse({ status: 200, description: 'Owner task retrieved successfully' })
  @ApiResponse({ status: 403, description: 'You are not the owner of this task' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async getTaskOwner(@Param() data: GetTaskDto, @Query() query: { email: string }) {
    const allTaskData = await this.taskService.getTaskOwner(query.email, Number(data.id));
    const condition = allTaskData.success;
    throw new HttpException(
      {
        code: condition ? HttpStatus.OK : Object.keys(allTaskData.data).length ? HttpStatus.FORBIDDEN : HttpStatus.NOT_FOUND,
        success: condition,
        message: allTaskData.message,
        data: {
          allTaskData: allTaskData.data,
        },
      },
      condition ? HttpStatus.OK : Object.keys(allTaskData.data).length ? HttpStatus.FORBIDDEN : HttpStatus.NOT_FOUND,
    );
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload task file - POSTMAN' })
  @ApiBody({ type: AddTaskDto })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @ApiResponse({ status: 400, description: 'File not uploaded | Task not found' })
  @UseInterceptors(FilesInterceptor('file'))
  async uploadFile(@Body() body: AddTaskDto, @UploadedFiles() file: Express.Multer.File[]) {
    const uploadData = await this.taskService.addTask(body.email, Number(body.classSubjectId), file);
    const length = Object.keys(uploadData).length > 0;
    throw new HttpException(
      {
        code: length ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST,
        success: length,
        message: length ? 'File uploaded successfully' : 'File not uploaded | Task not found',
        data: { uploadData },
      },
      length ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST,
    );
  }

  @Post('grade')
  @ApiOperation({ summary: 'Grade task' })
  @ApiBody({ type: GradeTaskDto })
  @ApiResponse({ status: 200, description: 'Task graded successfully' })
  @ApiResponse({ status: 400, description: 'Task not graded | Task not found' })
  async gradeTask(@Body() body: GradeTaskDto) {
    const gradeData = await this.taskService.gradeTask(body.email, Number(body.classSubjectId), Number(body.grade));
    const length = Object.keys(gradeData).length > 0;
    throw new HttpException(
      {
        code: length ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
        success: length,
        message: length ? 'Task graded successfully' : 'Task not graded | Task not found',
        data: gradeData,
      },
      length ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
    );
  }

  @Put('update')
  @ApiOperation({ summary: 'Update task file - POSTMAN' })
  @ApiBody({ type: AddTaskDto })
  @ApiResponse({ status: 200, description: 'File updated successfully' })
  @ApiResponse({ status: 400, description: 'File not updated | Task not found' })
  @UseInterceptors(FilesInterceptor('file'))
  async updateFile(@Body() body: AddTaskDto, @UploadedFiles() file: Express.Multer.File[]) {
    const updateData = await this.taskService.updateTask(body.email, Number(body.classSubjectId), file);
    const length = Object.keys(updateData).length > 0;
    throw new HttpException(
      {
        code: length ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
        success: length,
        message: length ? 'File updated successfully' : 'File not updated | Task not found',
        data: updateData,
      },
      length ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
    );
  }
}
