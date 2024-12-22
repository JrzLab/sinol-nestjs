import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { SignInDto } from './sign-in-dto';

export class SignUpDto extends SignInDto {
  @ApiProperty({
    description: 'Firstname of the user',
    example: 'firstName123',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;
}
