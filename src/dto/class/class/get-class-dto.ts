import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class GetClassDto {
  @ApiProperty({ description: 'Unique identifier for the class', example: 'n1jkbiu2b1' })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  uid: string;
}
