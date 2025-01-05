import { IsNotEmpty, IsString } from 'class-validator';

export class getSubjectDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
