import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class joinClassDto {
  @ApiProperty({ description: 'uid class', example: 'njad1231asd' })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  uidClass: string;

  @ApiProperty({ description: 'uid user class', example: 'njad1231asd' })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  uidClassUser: string;
}
