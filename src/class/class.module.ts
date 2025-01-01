import { Module } from '@nestjs/common';
import { ClassController } from './class/class.controller';
import { ClassService } from './class/class.service';
import { SubjectController } from './subject/subject.controller';
import { SubjectService } from './subject/subject.service';

@Module({
  controllers: [ClassController, SubjectController],
  providers: [ClassService, SubjectService]
})
export class ClassModule {}
