import { IsNotEmpty, IsString } from 'class-validator';
import { getClassDto } from './get-class-dto';
import { ApiProperty } from '@nestjs/swagger';

export class addClassDto extends getClassDto {
  @ApiProperty({ description: 'Unique identifier for the class', example: 'n1jkbiu2b1' })
  @IsString()
  @IsNotEmpty()
  uid: string;

  @ApiProperty({ description: 'Name of the class', example: 'Mathematics' })
  @IsString()
  @IsNotEmpty()
  className: string;

  @ApiProperty({ description: 'Description of the class', example: 'This is a mathematics class' })
  @IsString()
  @IsNotEmpty()
  description: string;
}
