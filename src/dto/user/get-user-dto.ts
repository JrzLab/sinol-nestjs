import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class getUserDto {
  @ApiProperty({
    description: 'Email of the user (either one is required)',
    example: 'user@example.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
