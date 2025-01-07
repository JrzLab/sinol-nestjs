import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserPrismaService } from '../userPrisma/user-prisma.service';

@Injectable()
export class TaskPrismaService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userPrismaService: UserPrismaService,
  ) {}

  async createFileFolder(data: { email: string; file: Express.Multer.File }) {
    const userData = await this.userPrismaService.findUserByIdentifier({ email: data.email });
    const folderPath = `./files/${userData.id}/tasks`;
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
    const filesData = fs.readdirSync(folderPath);
    const fileName = filesData.find((file) => file === `${data.file.originalname}`)
      ? `${folderPath}/${data.file.originalname.split('.')[0]}-${filesData.length + 1}.${data.file.originalname.split('.')[1]}`
      : `${folderPath}/${data.file.originalname}`;
    fs.writeFileSync(fileName, data.file.buffer);
    return fileName;
  }

  async getTask(where: { email?: string; classSubject?: number }) {
    const condition = where.email ? { user: { email: where.email } } : { classSubject: { id: where.classSubject } };
    return this.prismaService.userTask.findFirst({
      where: condition,
      include: {
        fileTask: true,
      },
    });
  }

  async addTask(data: { email: string; groupClassId: number }) {
    return this.prismaService.userTask.create({
      data: {
        status: 'PENDING',
        user: {
          connect: {
            email: data.email,
          },
        },
        classSubject: {
          connect: {
            id: data.groupClassId,
          },
        },
      },
    });
  }

  async addFileTask(data: { fileName: string; userTaskId: number; url: string }) {
    return this.prismaService.fileTask.create({
      data: {
        fileName: data.fileName,
        url: data.url,
        userTask: {
          connect: {
            id: data.userTaskId,
          },
        },
      },
    });
  }
}
