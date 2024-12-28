import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { RequestResetPassDto } from './request-reset-pass-dto';

export class ResetPasswordDto extends RequestResetPassDto {
  @ApiProperty({
    description: 'Password of the user (minimum 8 characters and maximum 16 characters)',
    example: 'securePassword123',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Token for password reset',
    example: 'token',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
