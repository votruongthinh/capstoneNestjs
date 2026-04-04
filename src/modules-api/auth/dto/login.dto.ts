import { IsEmail,IsNotEmpty,IsOptional,IsString } from "class-validator";


export class loginDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    mat_khau: string;
    
    @IsOptional()
    @IsString()
    token?:string;
} 