import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class updateClassDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  className: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
