import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class GetMessageAdminDto {
  @ApiProperty({ description: 'Owner User', example: 'emailexample@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  emailUser1: string;

  @ApiProperty({ description: 'Group Class UID', example: 'naskd123' })
  @MinLength(8)
  @IsNotEmpty()
  groupClassUid: string;
}
