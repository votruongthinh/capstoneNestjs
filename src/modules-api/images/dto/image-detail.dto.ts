// src/modules-system/images/dto/image-detail.dto.ts
export class ImageDetailDto {
  hinh_anh_id: number;
  ten_hinh: string;
  duong_dan: string;
  mo_ta: string;

  createdAt: Date;
  nguoi_dung: {
    nguoi_dung_id: number;
    ho_ten: string;
    anh_dai_dien?: string;
  };
}
