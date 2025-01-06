import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetMessageDto {
  @ApiProperty({ description: 'Id of the room', example: '1' })
  @IsString()
  @IsNotEmpty()
  idRoom: string;
}
