import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class updateClassDto {
  @ApiProperty({ description: 'Class uid', example: 'njad1231asd' })
  @IsString()
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
}
