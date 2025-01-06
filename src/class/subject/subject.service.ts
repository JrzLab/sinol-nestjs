import { Injectable } from '@nestjs/common';
import { classSubject } from '@prisma/client';
import { SubjectPrismaService } from 'src/prisma/subjectPrisma/subject-prisma.service';

@Injectable()
export class SubjectService {
  constructor(private readonly subjectPrismaService: SubjectPrismaService) {}

  private formatSubjectData({ id, title, description }: classSubject) {
    return { id, title, description };
  }

  async getSubjects(id: number) {
    const subjectDatas = await this.subjectPrismaService.getSubject({ groupClass: { id } });
    return subjectDatas.map(this.formatSubjectData);
  }

  async addSubject(title: string, description: string, id: number) {
    const subjectData = await this.subjectPrismaService.addSubject({
      title,
      description,
      groupClass: { connect: { id } },
    });
    return this.formatSubjectData(subjectData);
  }

  async editSubject(title: string, description: string, id: number) {
    const subjectData = await this.subjectPrismaService.editSubject({ id }, { title, description });
    return this.formatSubjectData(subjectData);
  }

  async deleteSubject(id: number) {
    const subjectData = await this.subjectPrismaService.deleteSubject({ id });
    return this.formatSubjectData(subjectData);
  }
}
