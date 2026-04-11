
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  ho_ten?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  tuoi?: number;
}