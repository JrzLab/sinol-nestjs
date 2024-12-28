import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// For app controller findUser
export class FindUserDto {
  @ApiProperty({
    description: 'Email of the user (either one is required)',
    example: 'user@example.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
