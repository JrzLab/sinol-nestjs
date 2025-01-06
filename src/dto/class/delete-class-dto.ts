import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class deleteClassDto {
  @ApiProperty({ description: 'Class ID', example: 1 })
  @IsString()
  @IsNotEmpty()
  id: string;
}
