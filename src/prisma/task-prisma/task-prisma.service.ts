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

  async createFileFolder(data: { email: string; file: Express.Multer.File[] }) {
    const { id } = await this.userPrismaService.findUserByIdentifier({ email: data.email });
    const folderPath = `./files/${id}/tasks`;
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
    const filesData = fs.readdirSync(folderPath);
    return data.file.map((filesUpload) => {
      const fileExitsL = filesData.filter((fileExits) => fileExits.includes(filesUpload.originalname.split('.')[0]));
      const fileName = fileExitsL.length
        ? `${filesUpload.originalname.split('.')[0]}-${fileExitsL.length + 1}.${filesUpload.originalname.split('.')[1]}`
        : filesUpload.originalname;
      fs.writeFileSync(`${folderPath}/${fileName}`, filesUpload.buffer);
      return fileName;
    });
  }

  async deleteFileAndTask(data: { email: string; file: { id: number; fileName: string; url: string; userTaskId: number }[] }) {
    const { id } = await this.userPrismaService.findUserByIdentifier({ email: data.email });
    const folderPath = `./files/${id}/tasks`;
    return Promise.all(
      data.file.map((file) => {
        fs.unlinkSync(`${folderPath}/${file.fileName}`);
        return this.prismaService.fileTask.delete({ where: { id: file.id } });
      }),
    );
  }

  async getTask(where: { email: string; classSubjectId: number }) {
    return this.prismaService.userTask.findFirst({
      where: {
        user: { email: where.email },
        classSubjectId: where.classSubjectId,
      },
      include: { fileTask: true },
    });
  }

  async getTaskAll(where: { email: string; classSubjectId: number }) {
    return this.prismaService.userTask.findMany({
      where: { classSubjectId: where.classSubjectId },
      include: {
        fileTask: true,
        classSubject: {
          select: {
            groupClass: { select: { owner: { select: { email: true } } } },
          },
        },
        user: { select: { firstName: true, lastName: true, email: true } },
      },
    });
  }

  async addTask(data: { email: string; classSubjectId: number }) {
    return this.prismaService.userTask.create({
      data: {
        user: { connect: { email: data.email } },
        classSubject: { connect: { id: data.classSubjectId } },
      },
    });
  }

  async gradeTask(where: { id: number }, data: { grade: number }) {
    return this.prismaService.userTask.update({
      where: {
        id: where.id,
      },
      data: {
        score: data.grade,
        status: 'COMPLATE',
      },
    });
  }

  async addFileTask(data: { fileName: string; userTaskId: number; url: string }) {
    await this.prismaService.userTask.update({
      where: {
        id: data.userTaskId,
      },
      data: {
        status: 'COLLECTING',
      },
    });

    return this.prismaService.fileTask.create({
      data: {
        fileName: data.fileName,
        url: data.url,
        userTask: { connect: { id: data.userTaskId } },
      },
    });
  }

  async deleteUserTask(where: { userEmail: string }) {
    return this.prismaService.userTask.deleteMany({ where: { user: { email: where.userEmail } } });
  }
}
