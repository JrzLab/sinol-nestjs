import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class VerifyTokenResetPassDto {
  @ApiProperty({ description: 'Token for reset password', example: '123456' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ description: 'Email of the user', example: 'userexample@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
