import { IsNotEmpty, IsString } from 'class-validator';
import { GetEmailDto } from './get-email-dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto extends GetEmailDto {
  @ApiProperty({ description: 'Message to send', example: 'Hello, how are you?' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ description: 'Id of the room', example: 1 })
  @IsString()
  @IsNotEmpty()
  idRoom: number;
}
