import { IsNotEmpty, IsString} from 'class-validator';
import { GetEmailDto } from './get-email-dto';

export class CreateMessageDto extends GetEmailDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  idRoom: number;
}
