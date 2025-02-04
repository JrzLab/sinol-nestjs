import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class DeleteClassDto {
  @ApiProperty({ description: 'Class UID', example: 'jiasodn1231' })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  uid: string;
}
