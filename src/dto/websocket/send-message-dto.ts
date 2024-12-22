import { IsString} from 'class-validator';
import { GetMessageDto } from './get-message-dto';

export class CreateMessageDto extends GetMessageDto {
  @IsString()
  message: string;
}
