import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AddTaskDto {
  @ApiProperty({ description: 'Email users for add task', example: 'email123@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Class subject id for identifier', example: '1' })
  @IsString()
  @IsNotEmpty()
  classSubjectId: string;
}
