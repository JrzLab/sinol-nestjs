import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteSubjectDto {
  @ApiProperty({ description: 'id of the subject', example: '1' })
  @IsString()
  @IsNotEmpty()
  id: string;
}
