import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class getTaskDto {
  @ApiProperty({ description: 'ClassSubject ID', example: 1 })
  @IsString()
  @IsNotEmpty()
  id: string;
}
