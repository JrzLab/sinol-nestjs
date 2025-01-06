import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { TaskService } from './task.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddTaskDto } from 'src/dto/class/add-task-dto';
import { getSubjectDto } from 'src/dto/class/get-subject-dto';
import { getClassDto } from 'src/dto/class/get-class-dto';

@Controller('class/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/:id')
  async getTask(@Param() data: getSubjectDto, @Query() query: getClassDto) {
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
