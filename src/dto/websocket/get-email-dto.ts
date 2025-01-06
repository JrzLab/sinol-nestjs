import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class GetEmailDto {
  @ApiProperty({ description: 'Email of the sender', example: 'userSender@gmail,com' })
  @IsEmail()
  @IsNotEmpty()
  identifySender: string;

  @ApiProperty({ description: 'Email of the reciver', example: 'userSender@gmail,com' })
  @IsEmail()
  @IsNotEmpty()
  identifyReciver: string;
}
