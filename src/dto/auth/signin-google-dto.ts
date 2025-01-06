import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class SigninGoogleDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'The email of the user',
    example: 'johndoe@example.com',
  })
  email: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  firstName: string;
  @IsOptional()
  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  lastName?: string | null;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The image url of the user',
    example: 'https://example.com/image.jpg / path/to/image.jpg',
  })
  imageUrl: string;
}
