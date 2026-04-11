import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

export class MulterConfig {
  static getOptions() {
    return {
      storage: diskStorage({
        destination: './public/images',
        filename: (req, file, cb) => {
          const fileExt = extname(file.originalname);
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `local-${uniqueSuffix}${fileExt}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = /jpg|jpeg|png|webp|gif/;
        const ext = extname(file.originalname).toLowerCase();

        if (allowedTypes.test(ext) && file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new BadRequestException('chỉ chấp nhận upload file ảnh'),false);
        }
      },
      limits:{
        fileSize: 5 * 1024 * 1024
      }
    };
  }
}
