import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class getSubjectDto {
  @ApiProperty({ description: 'Class uid', example: '123hui123' })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  uid: string;
}
