import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GetClassDto } from './get-class-dto';

export class AddClassDto extends GetClassDto {
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

  @ApiProperty({ description: 'Day of the class', example: '1' })
  @IsString()
  @IsNotEmpty()
  day: string;
}
