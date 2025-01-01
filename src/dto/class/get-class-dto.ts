import { IsEmail, IsNotEmpty } from 'class-validator';

export class getClassDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
