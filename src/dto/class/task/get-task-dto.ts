import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetTaskDto {
  @ApiProperty({ description: 'ClassSubject ID', example: '1' })
  @IsString()
  id: string;
}
