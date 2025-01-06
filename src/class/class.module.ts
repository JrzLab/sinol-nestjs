import { Module } from '@nestjs/common';
import { ClassController } from './class/class.controller';
import { ClassService } from './class/class.service';
import { SubjectController } from './subject/subject.controller';
import { SubjectService } from './subject/subject.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TaskController } from './task/task.controller';
import { TaskService } from './task/task.service';

@Module({
  imports: [PrismaModule],
  controllers: [ClassController, SubjectController, TaskController],
  providers: [ClassService, SubjectService, TaskService],
})
export class ClassModule {}
