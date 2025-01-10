import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { getClassDto } from './get-class-dto';

export class addClassDto extends getClassDto {
  @ApiProperty({ description: 'Name of the class', example: 'Mathematics' })
  @IsString()
  @IsNotEmpty()
  className: string;

  @ApiProperty({ description: 'Description of the class', example: 'This is a mathematics class' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'User email', example: 'userexample@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
