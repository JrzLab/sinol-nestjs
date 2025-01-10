import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TaskPrismaService } from 'src/prisma/task-prisma/task-prisma.service';

type UserTaskWithFile = Prisma.userTaskGetPayload<{
  include: {
    fileTask: true;
  };
}>;

@Injectable()
export class TaskService {
  constructor(private readonly taskPrismaService: TaskPrismaService) {}

  async getTask(email: string, classSubject: number): Promise<UserTaskWithFile> {
    const uTaskData = await this.taskPrismaService.getTask({ email, classSubject });
    if (!uTaskData) {
      await this.taskPrismaService.addTask({ email, groupClassId: classSubject });
      return this.getTask(email, classSubject);
    }
    return uTaskData;
  }

  async getTaskOwner(email: string, classSubject: number) {
    const allTaskData = await this.taskPrismaService.getTaskAll({ email, classSubject });

    if (email !== allTaskData[0].classSubject.groupClass.owner.email) {
      return {
        success: false,
        message: 'You are not the owner of this task',
        data: {},
      };
    }

    return {
      success: true,
      message: 'Owner task retrieved successfully',
      data: allTaskData.map((task) => ({
        id: task.id,
        username: `${task.user.firstName} ${task.user.lastName}`,
        imageUrl: task.user.imageUrl,
        status: task.status,
        userId: task.userId,
        fileTask: task.fileTask,
      })),
    };
  }

  async addTask(email: string, classSubject: number, file: Express.Multer.File) {
    const uTaskData = await this.taskPrismaService.getTask({ email, classSubject });
    const fileName = await this.taskPrismaService.createFileFolder({ email, file });
    return this.taskPrismaService.addFileTask({
      fileName,
      userTaskId: uTaskData.id,
      url: `/file/${uTaskData.id}/${fileName.split('/')[4]}?download=1`,
    });
  }
}
