import { Module } from '@nestjs/common';
import { ClassController } from './class/class.controller';
import { ClassService } from './class/class.service';
import { SubjectController } from './subject/subject.controller';
import { SubjectService } from './subject/subject.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ClassController, SubjectController],
  providers: [ClassService, SubjectService]
})
export class ClassModule {}
