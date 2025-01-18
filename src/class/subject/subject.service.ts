import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { classSubject } from '@prisma/client';
import { SubjectPrismaService } from 'src/prisma/subjectPrisma/subject-prisma.service';
import { TaskPrismaService } from 'src/prisma/task-prisma/task-prisma.service';

@Injectable()
export class SubjectService {
  constructor(
    private readonly subjectPrismaService: SubjectPrismaService,
    private readonly taskPrismaService: TaskPrismaService,
  ) {}

  private formatSubjectData({ id, title, description, dueDateAt, maxScore, status }: classSubject) {
    return { id, title, description, dueDateAt, maxScore, status };
  }

  async getSubjects(uid: string) {
    return (await this.subjectPrismaService.getSubject({ groupClass: { uid } })).map(this.formatSubjectData);
  }

  async addSubject(title: string, description: string, maxScore: number, dueDate: Date, uid: string) {
    const subjectData = await this.subjectPrismaService.addSubject({
      title,
      description,
      maxScore,
      dueDate,
      groupClass: { uid },
    });

    if (!subjectData) return {};

    if (subjectData.groupClass.joinClass.length) {
      subjectData.groupClass.joinClass.forEach(async (userClass) => {
        await this.taskPrismaService.addTask({ email: userClass.userClass.user.email, classSubjectId: subjectData.id });
      });
    }

    return this.formatSubjectData(subjectData);
  }

  async editSubject(title: string, description: string, maxScore: number, dueDate: Date, id: number) {
    const subjectData = await this.subjectPrismaService.editSubject({ id }, { title, description, maxScore, dueDate });

    if (!subjectData) return {};

    return this.formatSubjectData(subjectData);
  }

  async deleteSubject(id: number) {
    const subjectData = await this.subjectPrismaService.deleteSubject({ id });

    if (!subjectData) return {};

    return this.formatSubjectData(subjectData);
  }

  @Cron('0 * * * *')
  async handleCron() {
    const subjectDatas = await this.subjectPrismaService.getAllSubjectExp();
    for (const subjectData of subjectDatas) {
      await this.subjectPrismaService.updateStatusSubject({ id: subjectData.id }, { status: 'CLOSED' });
    }
  }
}
