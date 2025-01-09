import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class updateSubjectDto {
  @ApiProperty({ description: 'Title of the subject', example: 'Mathematics' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Description of the subject', example: 'Mathematics is the study of numbers, shapes, and patterns' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Id of the subject', example: 1 })
  @IsString()
  @IsNotEmpty()
  id: number;
}
