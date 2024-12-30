import { IsString, IsNotEmpty, IsEmail } from "class-validator";

export class VerifyTokenResetPassDto {
  @IsString()
  @IsNotEmpty()
  token: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
}