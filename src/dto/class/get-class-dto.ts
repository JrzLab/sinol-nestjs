import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class getClassDto {
  @ApiProperty({ description: 'User email', example: 'userEmail@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
