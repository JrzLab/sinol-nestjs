import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class getSubjectDto {
  @ApiProperty({ description: 'Class id', example: '1' })
  @IsString()
  @IsNotEmpty()
  id: string;
}
