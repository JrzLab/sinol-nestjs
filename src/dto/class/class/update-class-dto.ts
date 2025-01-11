import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class updateClassDto {
  @ApiProperty({ description: 'Class uid', example: 'njad1231asd' })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  uid: string;

  @ApiProperty({ description: 'Class name', example: 'Mathematics' })
  @IsString()
  @IsNotEmpty()
  className: string;

  @ApiProperty({ description: 'Class description', example: 'This is a mathematics class' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Owner email', example: 'userowner@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Day of the class', example: '1' })
  @IsString()
  @IsNotEmpty()
  day: string;
}
