import { Type } from 'class-transformer';
import { IsOptional, IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateImageDto {
  @IsString()
  @IsOptional()
  ten_hinh?: string;

  @IsOptional()
  @IsString()
  mo_ta?: string;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  nguoi_dung_id: number;
}
