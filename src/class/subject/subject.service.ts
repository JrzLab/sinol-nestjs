import { Injectable } from '@nestjs/common';
import { SubjectPrismaService } from 'src/prisma/subjectPrisma/subject-prisma.service';

@Injectable()
export class SubjectService {
  constructor(private readonly subjectPrismaService: SubjectPrismaService) {}

  async getSubjects(id: number) {
    return this.subjectPrismaService.getSubject({ groupClass: { id } });
  }

  async addSubject(title: string, description: string, id: number) {
    return this.subjectPrismaService.addSubject({
      title,
      description,
      groupClass: { connect: { id } },
    });
  }

  async editSubject(title: string, description: string, id: number) {
    return this.subjectPrismaService.editSubject({ id }, { title, description });
  }

  async deleteSubject(id: number) {
    return this.subjectPrismaService.deleteSubject({ id });
  }
}
