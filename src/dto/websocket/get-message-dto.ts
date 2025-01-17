import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class GetMessageDto {
  @ApiProperty({ description: 'Owner User', example: 'emailexample@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  emailUser1: string;

  @ApiProperty({ description: 'User', example: 'emailuser@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  emailUser2: string;
}
