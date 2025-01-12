import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { TaskService } from './task.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AddTaskDto } from 'src/dto/class/task/add-task-dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetTaskDto } from 'src/dto/class/task/get-task-dto';

@ApiTags('Task')
@Controller('class/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Get task by ID and Email' })
  @ApiParam({ name: 'id', type: 'string', description: 'ClassSubject ID' })
  @ApiQuery({ name: 'email', type: 'string', description: 'User Email' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully' })
  async getTask(@Param() data: GetTaskDto, @Query() query: { email: string }) {
    const uTaskData = await this.taskService.getTask(query.email, Number(data.id));
    throw new HttpException(
      {
        code: HttpStatus.OK,
        success: true,
        message: 'Task retrieved successfully',
        data: {
          status: uTaskData.status,
          fileTask: uTaskData.fileTask,
        },
      },
      HttpStatus.OK,
    );
  }

  @Get('owner/:id')
  @ApiOperation({ summary: 'Get task on owner' })
  @ApiParam({ name: 'id', type: 'string', description: 'ClassSubject ID' })
  @ApiQuery({ name: 'email', type: 'string', description: 'User Email' })
  @ApiResponse({ status: 200, description: 'Owner task retrieved successfully' })
  @ApiResponse({ status: 403, description: 'You are not the owner of this task' })
  async getTaskOwner(@Param() data: GetTaskDto, @Query() query: { email: string }) {
    const allTaskData = await this.taskService.getTaskOwner(query.email, Number(data.id));
    const condition = allTaskData.success;
    throw new HttpException(
      {
        code: condition ? HttpStatus.OK : HttpStatus.FORBIDDEN,
        success: condition,
        message: allTaskData.message,
        data: allTaskData.data,
      },
      condition ? HttpStatus.OK : HttpStatus.FORBIDDEN,
    );
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload task file - POSTMAN' })
  @ApiBody({ type: AddTaskDto })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @UseInterceptors(FilesInterceptor('file'))
  async uploadFile(@Body() body: AddTaskDto, @UploadedFiles() file: Express.Multer.File[]) {
    throw new HttpException(
      {
        code: HttpStatus.OK,
        success: true,
        message: 'File uploaded successfully',
        data: await this.taskService.addTask(body.email, Number(body.classSubjectId), file),
      },
      HttpStatus.CREATED,
    );
  }

  @Put('update')
  @ApiOperation({ summary: 'Update task file - POSTMAN' })
  @ApiBody({ type: AddTaskDto })
  @ApiResponse({ status: 200, description: 'File updated successfully' })
  @UseInterceptors(FilesInterceptor('file'))
  async updateFile(@Body() body: AddTaskDto, @UploadedFiles() file: Express.Multer.File[]) {
    throw new HttpException(
      {
        code: HttpStatus.OK,
        success: true,
        message: 'File updated successfully',
        data: await this.taskService.updateTask(body.email, Number(body.classSubjectId), file),
      },
      HttpStatus.OK,
    );
  }
}
