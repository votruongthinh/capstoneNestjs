import { IsEmail, IsNotEmpty, IsString,IsInt,IsOptional } from "class-validator";
export class registerDto{
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    mat_khau:string;

    @IsString()
    @IsNotEmpty()
    ho_ten: string;
    @IsOptional()
    @IsInt()
    tuoi?: number;
}