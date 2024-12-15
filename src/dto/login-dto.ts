import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        description: 'Email or username of the user (either one is required)',
        example: 'user@example.com',
    })
    @IsString()
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({
        description: 'Username of the user (used if email is not provided)',
        example: 'username123',
    })
    @IsString()
    @IsOptional()
    username?: string;

    @ApiProperty({
        description: 'Password of the user (minimum 8 characters)',
        example: 'securePassword123',
    })
    @IsString()
    @MinLength(8)
    @IsNotEmpty()
    password: string;
}
