import { IsNotEmpty, IsString } from 'class-validator';
import { getClassDto } from './get-class-dto';

export class addClassDto extends getClassDto {
  @IsString()
  @IsNotEmpty()
  uid: string;

  @IsString()
  @IsNotEmpty()
  className: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
