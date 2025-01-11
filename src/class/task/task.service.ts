import { Injectable } from '@nestjs/common';
import { TaskPrismaService } from 'src/prisma/task-prisma/task-prisma.service';
import { UserPrismaService } from 'src/prisma/userPrisma/user-prisma.service';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskPrismaService: TaskPrismaService,
    private readonly userPrismaService: UserPrismaService,
  ) {}

  async getTask(email: string, classSubject: number) {
    return this.taskPrismaService.getTask({ email, classSubject });
  }

  async getTaskOwner(email: string, classSubject: number) {
    const allTaskData = await this.taskPrismaService.getTaskAll({ email, classSubject });
    const isOwner = email === allTaskData[0].classSubject.groupClass.owner.email;

    return {
      success: isOwner,
      message: isOwner ? 'Owner task retrieved successfully' : 'You are not the owner of this task',
      data: isOwner ? allTaskData.map(task => ({
        username: `${task.user.firstName}${task.user.lastName ? ` ${task.user.lastName}` : ''}`,
        status: task.status,
        fileTask: task.fileTask,
      })) : {},
    };
  }

  async addTask(email: string, classSubject: number, file: Express.Multer.File[]) {
    const uTaskData = await this.taskPrismaService.getTask({ email, classSubject });
    const filesName = await this.taskPrismaService.createFileFolder({ email, file });
    const userData = await this.userPrismaService.findUserByIdentifier({ email });

    return Promise.all(filesName.map(fileName => 
      this.taskPrismaService.addFileTask({
        fileName,
        userTaskId: uTaskData.id,
        url: `/file/${userData.id}/${fileName.split(" ").join("%20")}?download=1`,
      })
    ));
  }
}
