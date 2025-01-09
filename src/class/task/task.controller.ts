import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { TaskService } from './task.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddTaskDto } from 'src/dto/class/add-task-dto';
import { getClassDto } from 'src/dto/class/get-class-dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { getTaskDto } from 'src/dto/class/get-task-dto';

@Controller('class/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'ClassSubject ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully' })
  async getTask(@Param() data: getTaskDto, @Query() query: getClassDto) {
    const uTaskData = await this.taskService.getTask(query.email, Number(data.id));
    throw new HttpException(
      {
        code: HttpStatus.OK,
        success: true,
        message: 'Task retrieved successfully',
        data: {
          id: uTaskData.id,
          status: uTaskData.status,
          userId: uTaskData.userId,
          fileTask: uTaskData.fileTask,
        },
      },
      HttpStatus.OK,
    );
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload task file' })
  @ApiBody({ type: AddTaskDto })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Body() body: AddTaskDto, @UploadedFile() file: Express.Multer.File) {
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
}
