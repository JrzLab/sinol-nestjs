import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class getSubjectDto {
  @ApiProperty({ description: 'Class uid', example: '123hui123' })
  @IsString()
  @IsNotEmpty()
  uid: string;
}
