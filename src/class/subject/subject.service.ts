import { Injectable } from '@nestjs/common';
import { classSubject } from '@prisma/client';
import { SubjectPrismaService } from 'src/prisma/subjectPrisma/subject-prisma.service';
import { TaskPrismaService } from 'src/prisma/task-prisma/task-prisma.service';

@Injectable()
export class SubjectService {
  constructor(
    private readonly subjectPrismaService: SubjectPrismaService,
    private readonly taskPrismaService: TaskPrismaService,
  ) {}

  private formatSubjectData({ id, title, description, dueDateAt, maxScore }: classSubject) {
    return { id, title, description, dueDateAt, maxScore };
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

    if (subjectData.groupClass.joinClass.length) {
      subjectData.groupClass.joinClass.forEach(async (userClass) => {
        await this.taskPrismaService.addTask({ email: userClass.userClass.user.email, classSubjectId: subjectData.id });
      });
    }

    return this.formatSubjectData(subjectData);
  }

  async editSubject(title: string, description: string, maxScore: number, dueDate: Date, id: number) {
    return this.formatSubjectData(await this.subjectPrismaService.editSubject({ id }, { title, description, maxScore, dueDate }));
  }

  async deleteSubject(id: number) {
    return this.formatSubjectData(await this.subjectPrismaService.deleteSubject({ id }));
  }
}
