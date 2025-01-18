import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetMessageIDDto {
  @ApiProperty({ description: 'ID Room', example: '1' })
  @IsString()
  @IsNotEmpty()
  id: string;
}
