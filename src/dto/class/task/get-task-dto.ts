import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class getTaskDto {
  @ApiProperty({ description: 'ClassSubject ID', example: "1" })
  @IsString()
  id: string;
}
