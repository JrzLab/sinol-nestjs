import { IsNotEmpty, IsString } from 'class-validator';

export class GetMessageDto {
  @IsString()
  @IsNotEmpty()
  idRoom: string;
}
