import { IsInt } from "class-validator";

export class CreateSavedImageDto {
    @IsInt()
    hinh_id: number;
}
