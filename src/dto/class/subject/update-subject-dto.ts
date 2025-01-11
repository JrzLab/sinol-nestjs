import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class updateSubjectDto {
  @ApiProperty({ description: 'Title of the subject', example: 'Mathematics' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Description of the subject', example: 'Mathematics is the study of numbers, shapes, and patterns' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Max score of the subject', example: 100 })
  @IsNumber()
  @IsNotEmpty()
  maxScore: number;

  @ApiProperty({ description: 'Due date of the subject', example: '2022-12-31' })
  @IsDateString()
  @IsNotEmpty()
  dueDate: Date;

  @ApiProperty({ description: 'Id of the subject', example: 1 })
  @IsString()
  @IsNotEmpty()
  id: number;
}
