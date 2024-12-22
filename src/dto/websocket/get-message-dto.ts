import { IsString } from 'class-validator';

export class GetMessageDto {
  @IsString()
  emailSender: string;

  @IsString()
  emailReciver: string;
}
