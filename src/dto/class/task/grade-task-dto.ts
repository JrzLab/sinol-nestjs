import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AddTaskDto } from './add-task-dto';

export class GradeTaskDto extends AddTaskDto {
  @ApiProperty({ description: 'Grade Task', example: '100' })
  @IsString()
  @IsNotEmpty()
  grade: string;
}
