import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class updateClassDto {
  @ApiProperty({ description: 'Class ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ description: 'Class name', example: 'Mathematics' })
  @IsString()
  @IsNotEmpty()
  className: string;

  @ApiProperty({ description: 'Class description', example: 'This is a mathematics class' })
  @IsString()
  @IsNotEmpty()
  description: string;
}
