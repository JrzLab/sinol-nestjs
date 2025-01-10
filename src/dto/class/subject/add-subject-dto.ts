import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class addSubjectDto {
  @ApiProperty({ description: 'Title of the subject', example: 'Mathematics' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Description of the subject', example: 'Mathematics is the study of numbers, shapes, and patterns' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Uid of the user class', example: '12312sad123' })
  @IsString()
  @IsNotEmpty()
  uid: string;
}
