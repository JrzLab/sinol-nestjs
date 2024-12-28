import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class RequestResetPassDto {
  @ApiProperty({
    description: 'Email of the user (either one is required)',
    example: 'user@example.com',
  })
  @IsString()
  @IsEmail()
  email: string;
}
