import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class addSubjectDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    id: number;
}