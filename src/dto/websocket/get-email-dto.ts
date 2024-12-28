import { IsEmail, IsNotEmpty } from 'class-validator';

export class GetEmailDto {
  @IsEmail()
  @IsNotEmpty()
  identifySender: string;

  @IsEmail()
  @IsNotEmpty()
  identifyReciver: string;
}
