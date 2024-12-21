import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class resetPasswordDto {
    @ApiProperty({
        description: 'Email is required',
        example: 'user@example.com',
    })
    @IsString()
    @IsEmail()
    email: string;
}
