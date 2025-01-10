import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { getClassDto } from './get-class-dto';
import { ApiProperty } from '@nestjs/swagger';

export class joinClassDto extends getClassDto {
  @ApiProperty({ description: 'uid user class', example: 'njad1231asd' })
  @IsString()
  @IsNotEmpty()
  uidUserClass: string;
}
