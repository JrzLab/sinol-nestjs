import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class getTaskDto {
  @ApiProperty({ description: 'ClassSubject ID', example: '1' })
  @IsString()
  id: string;
}
